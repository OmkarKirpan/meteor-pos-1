import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { GETORDERS } from "../../graphql/queries/order";
import NumberFormat from "react-number-format";
import { ORDEREVENTSUBSCRIPTION } from "../../graphql/subscriptions/order";
import { ORDERSTATUS } from "../../../constants";
import PropTypes from "prop-types";
import { Table } from "antd";
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
                title: i18n.__("order-no"),
                key: "orderNo",
                dataIndex: "orderNo",
                width: "20%",
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
                title: i18n.__("order-date"),
                key: "orderDate",
                dataIndex: "orderDate",
                width: "10%",
                render: orderDate =>
                    <div>
                        <strong>
                            {moment(orderDate).format("DD-MM-YYYY")}
                        </strong>
                    </div>
            },
            {
                title: i18n.__("order-customer-name"),
                key: "customer",
                dataIndex: "customer",
                width: "10%",
                render: customer =>
                    <div>
                        <strong>
                            {customer.name}
                        </strong>
                    </div>
            },
            {
                title: i18n.__("order-subtotal"),
                key: "subTotal",
                dataIndex: "orderItems",
                width: "20%",
                render: orderItems =>
                    <div>
                        <strong>
                            <span style={{ float: "left" }}>Rp</span>
                            <NumberFormat
                                value={orderItems.reduce((sum, orderItem) => {
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
                                }, 0)}
                                displayType={"text"}
                                thousandSeparator={true}
                                style={{ float: "right" }}
                            />
                        </strong>
                    </div>
            },
            {
                title: i18n.__("order-discount"),
                key: "discount",
                dataIndex: "orderItems",
                width: "20%",
                render: orderItems =>
                    <div>
                        <strong>
                            <span style={{ float: "left" }}>Rp</span>
                            <NumberFormat
                                value={orderItems.reduce((sum, orderItem) => {
                                    return (
                                        orderItem.itemPrices.reduce(
                                            (sum, itemPrices) => {
                                                return (
                                                    sum + itemPrices.discount
                                                );
                                            },
                                            sum
                                        ) + orderItem.discount
                                    );
                                }, 0)}
                                displayType={"text"}
                                thousandSeparator={true}
                                style={{ float: "right" }}
                            />
                        </strong>
                    </div>
            },
            {
                title: i18n.__("order-amount"),
                key: "amount",
                dataIndex: "orderItems",
                width: "20%",
                render: orderItems =>
                    <div>
                        <strong>
                            <span style={{ float: "left" }}>Rp</span>
                            <NumberFormat
                                value={orderItems.reduce((sum, orderItem) => {
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
                                }, 0)}
                                displayType={"text"}
                                thousandSeparator={true}
                                style={{ float: "right" }}
                            />
                        </strong>
                    </div>
            }
        ];

        const tableProps = {
            error,
            columns,
            loading,
            bordered: true,
            dataSource: orders,
            rowKey: "_id",
            size: "small",
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
