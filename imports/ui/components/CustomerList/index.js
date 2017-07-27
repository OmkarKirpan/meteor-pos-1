import { Col, Row, Switch, Table } from "antd";
import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { CUSTOMEREVENTSUBSCRIPTION } from "../../graphql/subscriptions/customer";
import { GETCUSTOMERS } from "../../graphql/queries/customer";
import PropTypes from "prop-types";
import { RECORDSTATUS } from "../../constants";
import { UPDATECUSTOMERSTATUS } from "../../graphql/mutations/customer";
import { cloneDeep } from "lodash";
import i18n from "meteor/universe:i18n";

@graphql(GETCUSTOMERS, {
    props: ({ data }) => {
        let {
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

            let customerIds = newProps.customers.map(({ _id }) => _id);

            this.unsubscribe = newProps.subscribeToMore({
                document: CUSTOMEREVENTSUBSCRIPTION,
                variables: { customerIds },
                updateQuery: (previousResult, { subscriptionData }) => {
                    let newResult = cloneDeep(previousResult);

                    let { data } = subscriptionData;
                    let { customerEvent } = data;
                    let {
                        CustomerCreated,
                        CustomerUpdated,
                        CustomerActivated,
                        CustomerInactivated
                    } = customerEvent;

                    if (CustomerCreated) {
                        newProps.refetch();
                    } else if (CustomerUpdated) {
                        newResult.customers.forEach(customer => {
                            if (customer._id === CustomerUpdated._id) {
                                customer.name = CustomerUpdated.name;
                                customer.address = CustomerUpdated.address;
                                customer.phoneNumber =
                                    CustomerUpdated.phoneNumber;
                                return;
                            }
                        });
                    } else if (CustomerActivated) {
                        newResult.customers.forEach(customer => {
                            if (customer._id === CustomerActivated._id) {
                                customer.status = RECORDSTATUS.ACTIVE;
                                return;
                            }
                        });
                    } else if (CustomerInactivated) {
                        newResult.customers.forEach(customer => {
                            if (customer._id === CustomerInactivated._id) {
                                customer.status = RECORDSTATUS.INACTIVE;
                                return;
                            }
                        });
                    }

                    return newResult;
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
            changeInventoriesPage,
            editCustomerForm,
            updateCustomerStatus
        } = this.props;

        const columns = [
            {
                title: i18n.__("customer-name"),
                key: "name",
                dataIndex: "name",
                width: "30%",
                render: (name, customer) =>
                    customer.status === RECORDSTATUS.ACTIVE
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
                width: "30%",
                render: address =>
                    <strong>
                        {address}
                    </strong>
            },
            {
                title: i18n.__("customer-phoneNumber"),
                key: "phoneNumber",
                dataIndex: "phoneNumber",
                width: "30%",
                render: phoneNumber =>
                    <strong>
                        {phoneNumber}
                    </strong>
            },
            {
                title: i18n.__("status"),
                key: "status",
                dataIndex: "status",
                width: "10%",
                render: (status, customer) =>
                    <Switch
                        className={
                            "customer-status-" +
                            (status === RECORDSTATUS.ACTIVE
                                ? "active"
                                : "inactive")
                        }
                        checked={status === RECORDSTATUS.ACTIVE}
                        onChange={() => {
                            const { _id } = customer;
                            updateCustomerStatus({
                                variables: {
                                    _id,
                                    newStatus:
                                        status === RECORDSTATUS.ACTIVE
                                            ? RECORDSTATUS.INACTIVE
                                            : RECORDSTATUS.ACTIVE
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
                    changeInventoriesPage({ client, current: page });
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
