import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { GETORDERS } from "../../graphql/queries/order";
import { ORDEREVENTSUBSCRIPTION } from "../../graphql/subscriptions/order";
import { ORDERSTATUS } from "../../../constants";
import PropTypes from "prop-types";
import { Table } from "antd";
import { formatCurrency } from "../../../util/currency";
import i18n from "meteor/universe:i18n";
import moment from "moment";

@graphql(GETORDERS, {
    props: ({ data }) => {
        const {
            orders,
            orderCount,
            loading,
            error,
            subscribeToMore,
            refetch
        } = data;
        return {
            orders,
            total: orderCount,
            loading,
            error,
            subscribeToMore,
            refetch
        };
    },
    options: ({ current, pageSize, filter }) => {
        return {
            fetchPolicy: "network-only",
            variables: {
                skip: (current - 1) * pageSize,
                pageSize,
                filter: filter || {}
            }
        };
    }
})
@compose(withApollo)
class OrderList extends Component {
    componentWillReceiveProps(newProps) {
        if (!newProps.loading) {
            if (this.unsubscribe) {
                if (newProps.orders !== this.props.orders) {
                    this.unsubscribe();
                } else {
                    return;
                }
            }

            const orderIds = newProps.orders.map(({ _id }) => _id);

            this.unsubscribe = newProps.subscribeToMore({
                document: ORDEREVENTSUBSCRIPTION,
                variables: { orderIds },
                updateQuery: (previousResult, { subscriptionData }) => {
                    const { data } = subscriptionData;
                    const { orderEvent } = data;
                    const {
                        OrderCreated,
                        OrderCancelled,
                        OrderFinalized,
                        OrderCompleted
                    } = orderEvent;

                    if (
                        OrderCreated ||
                        OrderCancelled ||
                        OrderFinalized ||
                        OrderCompleted
                    ) {
                        newProps.refetch({
                            fetchPolicy: "network-only",
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
            filter,
            loading,
            error,
            orders,
            total,
            client,
            current,
            pageSize,
            changeOrdersPage,
            editOrderForm
        } = this.props;

        const columns = [
            {
                title: (
                    <strong>
                        {i18n.__("order-orderNo")}
                    </strong>
                ),
                key: "orderNo",
                dataIndex: "orderNo",
                width: "15%",
                render: (orderNo, order) =>
                    <a
                        onClick={() => {
                            const { _id } = order;
                            editOrderForm({ client, _id });
                        }}
                    >
                        <strong>
                            {orderNo}
                        </strong>
                    </a>
            },
            {
                title: (
                    <strong>
                        {i18n.__("order-orderDate")}
                    </strong>
                ),
                key: "orderDate",
                dataIndex: "orderDate",
                width: "10%",
                render: orderDate =>
                    <span>
                        {moment(orderDate).format("DD-MM-YYYY")}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("order-customer-name")}
                    </strong>
                ),
                key: "customer",
                dataIndex: "customer",
                width: "15%",
                render: customer =>
                    <span>
                        {customer.name}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("order-subTotal")}
                    </strong>
                ),
                key: "subTotal",
                dataIndex: "orderItems",
                width: "20%",
                render: orderItems =>
                    <span>
                        {formatCurrency(
                            orderItems.reduce((sum, orderItem) => {
                                return orderItem.itemPrices.reduce(
                                    (sum, itemPrices) => {
                                        return (
                                            sum +
                                            itemPrices.quantity *
                                                itemPrices.price
                                        );
                                    },
                                    sum
                                );
                            }, 0)
                        )}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("order-discount")}
                    </strong>
                ),
                key: "discount",
                dataIndex: "orderItems",
                width: "20%",
                render: orderItems =>
                    <span>
                        {formatCurrency(
                            orderItems.reduce((sum, orderItem) => {
                                return (
                                    orderItem.itemPrices.reduce(
                                        (sum, itemPrices) => {
                                            return sum + itemPrices.discount;
                                        },
                                        sum
                                    ) + orderItem.discount
                                );
                            }, 0)
                        )}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("order-total")}
                    </strong>
                ),
                key: "total",
                dataIndex: "orderItems",
                width: "20%",
                render: orderItems =>
                    <span>
                        {formatCurrency(
                            orderItems.reduce((sum, orderItem) => {
                                return (
                                    orderItem.itemPrices.reduce(
                                        (sum, itemPrices) => {
                                            return (
                                                sum +
                                                itemPrices.quantity *
                                                    itemPrices.price -
                                                itemPrices.discount
                                            );
                                        },
                                        sum
                                    ) - orderItem.discount
                                );
                            }, 0)
                        )}
                    </span>
            }
        ];

        const tableProps = {
            error,
            columns,
            loading,
            dataSource: orders,
            rowKey: "_id",
            size: "middle",
            pagination: {
                current,
                total,
                pageSize,
                onChange: page => {
                    changeOrdersPage({ client, current: page });
                }
            },
            locale: {
                emptyText: i18n.__("no-data")
            }
        };

        return <Table {...tableProps} />;
    }
}

OrderList.propTypes = {
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default OrderList;
