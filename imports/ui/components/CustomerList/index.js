import { Col, Row, Switch, Table } from "antd";
import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { CUSTOMEREVENTSUBSCRIPTION } from "../../graphql/subscriptions/customer";
import { ENTITYSTATUS } from "../../../constants";
import { GETCUSTOMERS } from "../../graphql/queries/customer";
import PropTypes from "prop-types";
import { UPDATECUSTOMERSTATUS } from "../../graphql/mutations/customer";
import { cloneDeep } from "lodash";
import i18n from "meteor/universe:i18n";

@graphql(GETCUSTOMERS, {
    props: ({ data }) => {
        const {
            customers,
            customerCount,
            loading,
            error,
            subscribeToMore,
            refetch
        } = data;
        return {
            customers,
            total: customerCount,
            loading,
            error,
            subscribeToMore,
            refetch
        };
    },
    options: ({ current, pageSize, filter }) => {
        return {
            variables: {
                skip: (current - 1) * pageSize,
                pageSize,
                filter: filter || {}
            }
        };
    }
})
@graphql(UPDATECUSTOMERSTATUS, {
    name: "updateCustomerStatus"
})
@compose(withApollo)
class CustomerList extends Component {
    componentWillReceiveProps(newProps) {
        if (!newProps.loading) {
            if (this.unsubscribe) {
                if (newProps.customers !== this.props.customers) {
                    this.unsubscribe();
                } else {
                    return;
                }
            }

            const customerIds = newProps.customers.map(({ _id }) => _id);

            this.unsubscribe = newProps.subscribeToMore({
                document: CUSTOMEREVENTSUBSCRIPTION,
                variables: { customerIds },
                updateQuery: (previousResult, { subscriptionData }) => {
                    const { data } = subscriptionData;
                    const { customerEvent } = data;
                    const { CustomerCreated } = customerEvent;

                    if (CustomerCreated) {
                        newProps.refetch({
                            variables: {
                                skip:
                                    (newProps.current - 1) * newProps.pageSize,
                                pageSize: newProps.pageSize,
                                filter: newProps.filter || {}
                            }
                        });
                    }

                    return previousResult;
                },
                onError: err => console.error(err)
            });
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    render() {
        const {
            loading,
            error,
            customers,
            total,
            client,
            current,
            pageSize,
            changeItemsPage,
            editCustomerForm,
            updateCustomerStatus
        } = this.props;

        const columns = [
            {
                title: i18n.__("customer-name"),
                key: "name",
                dataIndex: "name",
                width: "20%",
                render: (name, customer) =>
                    customer.entityStatus === ENTITYSTATUS.ACTIVE
                        ? <a
                              onClick={() => {
                                  const { _id } = customer;
                                  editCustomerForm({ client, _id });
                              }}
                          >
                              <strong>
                                  {name}
                              </strong>
                          </a>
                        : <strong>
                              {name}
                          </strong>
            },
            {
                title: i18n.__("customer-address"),
                key: "address",
                dataIndex: "address",
                width: "20%",
                render: address =>
                    <strong>
                        {address}
                    </strong>
            },
            {
                title: i18n.__("customer-phoneNumber"),
                key: "phoneNumber",
                dataIndex: "phoneNumber",
                width: "25%",
                render: phoneNumber =>
                    <strong>
                        {phoneNumber}
                    </strong>
            },
            {
                title: i18n.__("customer-cellphoneNumber"),
                key: "cellphoneNumber",
                dataIndex: "cellphoneNumber",
                width: "25%",
                render: phoneNumber =>
                    <strong>
                        {phoneNumber}
                    </strong>
            },
            {
                title: i18n.__("entityStatus"),
                key: "entityStatus",
                dataIndex: "entityStatus",
                width: "10%",
                render: (entityStatus, customer) =>
                    <Switch
                        className={
                            "customer-entityStatus-" +
                            (entityStatus === ENTITYSTATUS.ACTIVE
                                ? "active"
                                : "inactive")
                        }
                        checked={entityStatus === ENTITYSTATUS.ACTIVE}
                        onChange={() => {
                            const { _id } = customer;
                            updateCustomerStatus({
                                variables: {
                                    _id,
                                    newStatus:
                                        entityStatus === ENTITYSTATUS.ACTIVE
                                            ? ENTITYSTATUS.INACTIVE
                                            : ENTITYSTATUS.ACTIVE
                                }
                            });
                        }}
                    />
            }
        ];

        const tableProps = {
            error,
            columns,
            loading,
            bordered: true,
            dataSource: customers,
            rowKey: "_id",
            size: "small",
            pagination: {
                current,
                total,
                pageSize,
                onChange: page => {
                    changeItemsPage({ client, current: page });
                }
            },
            locale: {
                emptyText: i18n.__("no-data")
            }
        };

        return <Table {...tableProps} />;
    }
}

CustomerList.propTypes = {
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default CustomerList;
