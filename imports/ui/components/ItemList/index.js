import "./index.scss";

import { Button, Col, Row, Switch, Table } from "antd";
import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { ENTITYSTATUS } from "../../../constants";
import { GETITEMS } from "../../graphql/queries/item";
import { ITEMEVENTSUBSCRIPTION } from "../../graphql/subscriptions/item";
import ItemListPrices from "../ItemListPrices";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import { UPDATEITEMSTATUS } from "../../graphql/mutations/item";
import { cloneDeep } from "lodash";
import i18n from "meteor/universe:i18n";

@graphql(GETITEMS, {
    props: ({ data }) => {
        const {
            items,
            itemCount,
            loading,
            error,
            subscribeToMore,
            refetch
        } = data;
        return {
            items,
            total: itemCount,
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
            },
            fetchPolicy: "network-only"
        };
    }
})
@graphql(UPDATEITEMSTATUS, {
    name: "updateItemStatus"
})
@compose(withApollo)
class ItemList extends Component {
    componentWillReceiveProps(newProps) {
        if (!newProps.loading) {
            if (this.unsubscribe) {
                if (newProps.items !== this.props.items) {
                    this.unsubscribe();
                } else {
                    return;
                }
            }

            const itemIds = newProps.items.map(({ _id }) => _id);

            this.unsubscribe = newProps.subscribeToMore({
                document: ITEMEVENTSUBSCRIPTION,
                variables: { itemIds },
                updateQuery: (previousResult, { subscriptionData }) => {
                    const { data } = subscriptionData;
                    const { itemEvent } = data;
                    const { ItemCreated } = itemEvent;

                    if (ItemCreated) {
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
            items,
            total,
            client,
            current,
            pageSize,
            changeItemsPage,
            editItemForm,
            updateItemStatus
        } = this.props;

        const columns = [
            {
                title: (
                    <strong>
                        {i18n.__("item-name")}
                    </strong>
                ),
                key: "name",
                dataIndex: "name",
                width: "20%",
                render: (name, item) =>
                    item.entityStatus === ENTITYSTATUS.ACTIVE
                        ? <a
                              onClick={() => {
                                  const { _id } = item;
                                  editItemForm({ client, _id });
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
                        {i18n.__("item-category")}
                    </strong>
                ),
                key: "category",
                dataIndex: "category",
                width: "20%",
                render: category =>
                    <span>
                        {category ? category.name : ""}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("item-brand")}
                    </strong>
                ),
                key: "brand",
                dataIndex: "brand",
                width: "20%",
                render: brand =>
                    <span>
                        {brand ? brand.name : ""}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("item-stock")}
                    </strong>
                ),
                key: "stock",
                dataIndex: "stock",
                width: "20%",
                render: (stock, record) => {
                    if (!record.allPrices) return <div />;
                    const allPrices = record.allPrices;
                    const stockStr = [];
                    let itemStock = stock;
                    if (itemStock <= 0)
                        return (
                            <span className="item-stock-warning">
                                {`${itemStock} ${record.baseUnit}`}
                            </span>
                        );
                    allPrices.forEach(itemPrice => {
                        if (itemStock >= itemPrice.multiplier) {
                            stockStr.push(
                                Math.floor(itemStock / itemPrice.multiplier) +
                                    " " +
                                    itemPrice.unit
                            );
                            itemStock %= itemPrice.multiplier;
                        }
                    });
                    return (
                        <span>
                            {stockStr.join(" ")}
                        </span>
                    );
                }
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
                render: (entityStatus, item) =>
                    <Button
                        style={{ width: "100%" }}
                        onClick={() => {
                            const { _id } = item;
                            updateItemStatus({
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
            error,
            columns,
            loading,
            expandedRowRender: item => <ItemListPrices item={item} />,
            dataSource: items,
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

ItemList.propTypes = {
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default ItemList;
