import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { GETSUPPLYORDERS } from "../../graphql/queries/supplyOrder";
import PropTypes from "prop-types";
import { SUPPLYORDEREVENTSUBSCRIPTION } from "../../graphql/subscriptions/supplyOrder";
import SupplyOrderListItems from "../SupplyOrderListItems";
import { Table } from "antd";
import { formatCurrency } from "../../../util/currency";
import i18n from "meteor/universe:i18n";
import moment from "moment";

@graphql(GETSUPPLYORDERS, {
    props: ({ data }) => {
        const {
            supplyOrders,
            supplyOrderCount,
            loading,
            error,
            subscribeToMore,
            refetch
        } = data;
        return {
            supplyOrders,
            total: supplyOrderCount,
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
class SupplyOrderList extends Component {
    componentWillReceiveProps(newProps) {
        if (!newProps.loading) {
            if (this.unsubscribe) {
                if (newProps.supplyOrders !== this.props.supplyOrders) {
                    this.unsubscribe();
                } else {
                    return;
                }
            }

            this.unsubscribe = newProps.subscribeToMore({
                document: SUPPLYORDEREVENTSUBSCRIPTION,
                variables: {},
                updateQuery: (previousResult, { subscriptionData }) => {
                    const { data } = subscriptionData;
                    const { supplyOrderEvent } = data;
                    const { SupplyOrderCreated } = supplyOrderEvent;

                    if (SupplyOrderCreated) {
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
            supplyOrders,
            total,
            client,
            current,
            pageSize,
            changesupplyOrdersPage
        } = this.props;

        const columns = [
            {
                title: (
                    <strong>
                        {i18n.__("supplyOrder-orderNo")}
                    </strong>
                ),
                key: "orderNo",
                dataIndex: "orderNo",
                width: "20%",
                render: orderNo =>
                    <strong>
                        {orderNo}
                    </strong>
            },
            {
                title: (
                    <strong>
                        {i18n.__("supplyOrder-orderDate")}
                    </strong>
                ),
                key: "orderDate",
                dataIndex: "orderDate",
                width: "20%",
                render: orderDate =>
                    <span>
                        {moment(orderDate).format("DD-MM-YYYY")}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("supplyOrder-subTotal")}
                    </strong>
                ),
                key: "subTotal",
                dataIndex: "supplyItems",
                width: "20%",
                render: supplyItems =>
                    <span>
                        {formatCurrency(
                            (supplyItems || []).reduce((sum, supplyItem) => {
                                return (
                                    sum + supplyItem.quantity * supplyItem.price
                                );
                            }, 0)
                        )}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("supplyOrder-discount")}
                    </strong>
                ),
                key: "discount",
                dataIndex: "discount",
                width: "20%",
                render: discount =>
                    <span>
                        {formatCurrency(discount)}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("supplyOrder-total")}
                    </strong>
                ),
                key: "total",
                dataIndex: "supplyItems",
                width: "20%",
                render: (supplyItems, supplyOrder) =>
                    <span>
                        {formatCurrency(
                            (supplyItems || []).reduce((sum, supplyItem) => {
                                return (
                                    sum + supplyItem.quantity * supplyItem.price
                                );
                            }, -supplyOrder.discount)
                        )}
                    </span>
            }
        ];

        const tableProps = {
            error,
            columns,
            loading,
            dataSource: supplyOrders,
            expandedRowRender: supplyOrder =>
                <SupplyOrderListItems supplyOrder={supplyOrder} />,
            rowKey: "_id",
            size: "middle",
            pagination: {
                current,
                total,
                pageSize,
                onChange: page => {
                    changesupplyOrdersPage({ client, current: page });
                }
            },
            locale: {
                emptyText: i18n.__("no-data")
            }
        };

        return <Table {...tableProps} />;
    }
}

SupplyOrderList.propTypes = {
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default SupplyOrderList;
