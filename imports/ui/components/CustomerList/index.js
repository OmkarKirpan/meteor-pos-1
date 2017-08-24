import "./index.scss";

import { ApolloClient, compose, gql, graphql, withApollo } from "react-apollo";
import { Button, Table } from "antd";
import React, { Component } from "react";

import { CUSTOMEREVENTSUBSCRIPTION } from "../../graphql/subscriptions/customer";
import { ENTITYSTATUS } from "../../../constants";
import { GETCUSTOMERS } from "../../graphql/queries/customer";
import PropTypes from "prop-types";
import { UPDATECUSTOMERSTATUS } from "../../graphql/mutations/customer";
import i18n from "meteor/universe:i18n";

@graphql(GETCUSTOMERS, {
    props: ({ data }) => {
        const {
            customers,
            customerCount,
            loading,
            subscribeToMore,
            refetch
        } = data;
        return {
            customers,
            total: customerCount,
            loading,
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
            },
            fetchPolicy: "network-only"
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
                title: (
                    <strong>
                        {i18n.__("customer-name")}
                    </strong>
                ),
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
                title: (
                    <strong>
                        {i18n.__("customer-address")}
                    </strong>
                ),
                key: "address",
                dataIndex: "address",
                width: "20%",
                render: address =>
                    <span>
                        {address}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("customer-phoneNumber")}
                    </strong>
                ),
                key: "phoneNumber",
                dataIndex: "phoneNumber",
                width: "20%",
                render: phoneNumber =>
                    <span>
                        {phoneNumber}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("customer-cellphoneNumber")}
                    </strong>
                ),
                key: "cellphoneNumber",
                dataIndex: "cellphoneNumber",
                width: "20%",
                render: phoneNumber =>
                    <span>
                        {phoneNumber}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("entityStatus")}
                    </strong>
                ),
                key: "entityStatus",
                dataIndex: "entityStatus",
                width: "10%",
                render: entityStatus =>
                    <span
                        className={
                            "entity-status-" +
                            (entityStatus === ENTITYSTATUS.ACTIVE
                                ? "active"
                                : "inactive")
                        }
                    >
                        {entityStatus === ENTITYSTATUS.ACTIVE
                            ? i18n.__("entityStatus-active")
                            : i18n.__("entityStatus-inactive")}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("action")}
                    </strong>
                ),
                key: "action",
                dataIndex: "entityStatus",
                width: "10%",
                render: (entityStatus, customer) =>
                    <Button
                        style={{ width: "100%" }}
                        onClick={() => {
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
                    >
                        {entityStatus === ENTITYSTATUS.ACTIVE
                            ? i18n.__("deactivate")
                            : i18n.__("activate")}
                    </Button>
            }
        ];

        const tableProps = {
            columns,
            loading,
            dataSource: customers,
            rowKey: "_id",
            size: "middle",
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
    loading: PropTypes.bool,
    customers: PropTypes.array,
    total: PropTypes.number,
    client: PropTypes.instanceOf(ApolloClient),
    current: PropTypes.number,
    pageSize: PropTypes.number,
    changeItemsPage: PropTypes.func,
    editCustomerForm: PropTypes.func,
    updateCustomerStatus: PropTypes.func
};

export default CustomerList;
