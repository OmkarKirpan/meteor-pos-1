import { ApolloClient, compose, gql, graphql, withApollo } from "react-apollo";
import React, { Component } from "react";

import { GETITEMADJUSTMENTS } from "../../graphql/queries/itemAdjustment";
import { ITEMADJUSTMENTEVENTSUBSCRIPTION } from "../../graphql/subscriptions/itemAdjustment";
import ItemAdjustmentListItems from "../ItemAdjustmentListItems";
import PropTypes from "prop-types";
import { Table } from "antd";
import i18n from "meteor/universe:i18n";
import moment from "moment";

@graphql(GETITEMADJUSTMENTS, {
    props: ({ data }) => {
        const {
            itemAdjustments,
            itemAdjustmentCount,
            loading,
            subscribeToMore,
            refetch
        } = data;
        return {
            itemAdjustments,
            total: itemAdjustmentCount,
            loading,
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
class ItemAdjustmentList extends Component {
    componentWillReceiveProps(newProps) {
        if (!newProps.loading) {
            if (this.unsubscribe) {
                if (newProps.itemAdjustments !== this.props.itemAdjustments) {
                    this.unsubscribe();
                } else {
                    return;
                }
            }

            const itemAdjustmentIds = newProps.itemAdjustments.map(
                ({ _id }) => _id
            );

            this.unsubscribe = newProps.subscribeToMore({
                document: ITEMADJUSTMENTEVENTSUBSCRIPTION,
                variables: { itemAdjustmentIds },
                updateQuery: (previousResult, { subscriptionData }) => {
                    const { data } = subscriptionData;
                    const { itemAdjustmentEvent } = data;
                    const { ItemAdjustmentCreated } = itemAdjustmentEvent;

                    if (ItemAdjustmentCreated) {
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
            loading,
            itemAdjustments,
            total,
            client,
            current,
            pageSize,
            changeItemAdjustmentsPage
        } = this.props;

        const columns = [
            {
                title: (
                    <strong>
                        {i18n.__("itemAdjustment-adjustmentNo")}
                    </strong>
                ),
                key: "adjustmentNo",
                dataIndex: "adjustmentNo",
                width: "20%",
                render: adjustmentNo =>
                    <strong>
                        {adjustmentNo}
                    </strong>
            },
            {
                title: (
                    <strong>
                        {i18n.__("itemAdjustment-adjustmentDate")}
                    </strong>
                ),
                key: "adjustmentDate",
                dataIndex: "adjustmentDate",
                width: "20%",
                render: adjustmentDate =>
                    <span>
                        {moment(adjustmentDate).format("DD-MM-YYYY")}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("itemAdjustment-reason")}
                    </strong>
                ),
                key: "reason",
                dataIndex: "reason",
                width: "60%",
                render: reason =>
                    <span>
                        {reason}
                    </span>
            }
        ];

        const tableProps = {
            columns,
            loading,
            dataSource: itemAdjustments,
            expandedRowRender: itemAdjustment =>
                <ItemAdjustmentListItems itemAdjustment={itemAdjustment} />,
            rowKey: "_id",
            size: "middle",
            pagination: {
                current,
                total,
                pageSize,
                onChange: page => {
                    changeItemAdjustmentsPage({ client, current: page });
                }
            },
            locale: {
                emptyText: i18n.__("no-data")
            }
        };

        return <Table {...tableProps} />;
    }
}

ItemAdjustmentList.propTypes = {
    loading: PropTypes.bool,
    itemAdjustments: PropTypes.array,
    total: PropTypes.number,
    client: PropTypes.instanceOf(ApolloClient),
    current: PropTypes.number,
    pageSize: PropTypes.number,
    changeItemAdjustmentsPage: PropTypes.func
};

export default ItemAdjustmentList;
