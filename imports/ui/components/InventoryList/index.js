import { Col, Row, Switch, Table } from "antd";
import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { GETINVENTORIES } from "../../graphql/queries/inventory";
import { INVENTORYEVENTSUBSCRIPTION } from "../../graphql/subscriptions/inventory";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import { RECORDSTATUS } from "../../constants";
import { UPDATEINVENTORYSTATUS } from "../../graphql/mutations/inventory";
import { cloneDeep } from "lodash";
import i18n from "meteor/universe:i18n";

@graphql(GETINVENTORIES, {
    props: ({ data }) => {
        let {
            inventories,
            inventoryCount,
            loading,
            error,
            subscribeToMore,
            refetch
        } = data;
        return {
            inventories,
            total: inventoryCount,
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
@graphql(UPDATEINVENTORYSTATUS, {
    name: "updateInventoryStatus"
})
@compose(withApollo)
class InventoryList extends Component {
    componentWillReceiveProps(newProps) {
        if (!newProps.loading) {
            if (this.unsubscribe) {
                if (newProps.inventories !== this.props.inventories) {
                    this.unsubscribe();
                } else {
                    return;
                }
            }

            let inventoryIds = newProps.inventories.map(({ _id }) => _id);

            this.unsubscribe = newProps.subscribeToMore({
                document: INVENTORYEVENTSUBSCRIPTION,
                variables: { inventoryIds },
                updateQuery: (previousResult, { subscriptionData }) => {
                    let newResult = cloneDeep(previousResult);

                    let { data } = subscriptionData;
                    let { inventoryEvent } = data;
                    let {
                        InventoryCreated,
                        InventoryUpdated,
                        InventoryActivated,
                        InventoryInactivated
                    } = inventoryEvent;

                    if (InventoryCreated) {
                        newProps.refetch();
                    } else if (InventoryUpdated) {
                        newResult.inventories.forEach(inventory => {
                            if (inventory._id === InventoryUpdated._id) {
                                inventory.name = InventoryUpdated.name;
                                inventory.basePrice =
                                    InventoryUpdated.basePrice;
                                inventory.baseUnit = InventoryUpdated.baseUnit;
                                inventory.prices = InventoryUpdated.prices;
                                return;
                            }
                        });
                    } else if (InventoryActivated) {
                        newResult.inventories.forEach(inventory => {
                            if (inventory._id === InventoryActivated._id) {
                                inventory.status = RECORDSTATUS.ACTIVE;
                                return;
                            }
                        });
                    } else if (InventoryInactivated) {
                        newResult.inventories.forEach(inventory => {
                            if (inventory._id === InventoryActivated._id) {
                                inventory.status = RECORDSTATUS.INACTIVE;
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
            inventories,
            total,
            client,
            current,
            pageSize,
            changeInventoriesPage,
            editInventoryForm,
            updateInventoryStatus
        } = this.props;

        const columns = [
            {
                title: i18n.__("inventory-name"),
                key: "name",
                dataIndex: "name",
                width: "40%",
                render: (name, inventory) =>
                    <a
                        onClick={() => {
                            const { _id } = inventory;
                            editInventoryForm({ client, _id });
                        }}
                    >
                        <strong>
                            {name}
                        </strong>
                    </a>
            },
            {
                title: i18n.__("inventory-price"),
                key: "basePrice",
                dataIndex: "basePrice",
                width: "20%",
                render: basePrice =>
                    <div>
                        <span style={{ float: "left" }}>Rp</span>
                        <NumberFormat
                            value={basePrice}
                            displayType={"text"}
                            thousandSeparator={true}
                            style={{ float: "right" }}
                        />
                    </div>
            },
            {
                title: i18n.__("inventory-stock"),
                key: "stock",
                dataIndex: "stock",
                width: "30%",
                render: (stock, record) => {
                    if (!record.prices) return <div />;
                    let sortedPrices = [];
                    sortedPrices.push({ unit: record.baseUnit, multiplier: 1 });
                    record.prices.forEach(price =>
                        sortedPrices.push({
                            unit: price.unit,
                            multiplier: price.multiplier
                        })
                    );
                    sortedPrices.sort(
                        (price1, price2) =>
                            price2.multiplier - price1.multiplier
                    );
                    let stockStr = [];
                    let inventoryStock = stock;
                    if (inventoryStock === 0)
                        return (
                            <span style={{ float: "right" }}>
                                {"0 " + record.baseUnit}
                            </span>
                        );
                    sortedPrices.forEach(price => {
                        if (inventoryStock >= price.multiplier) {
                            stockStr.push(
                                Math.floor(inventoryStock / price.multiplier) +
                                    " " +
                                    price.unit
                            );
                            inventoryStock %= price.multiplier;
                        }
                    });
                    return (
                        <span style={{ float: "right" }}>
                            {stockStr.join(" ")}
                        </span>
                    );
                }
            },
            {
                title: i18n.__("status"),
                key: "status",
                dataIndex: "status",
                width: "10%",
                render: (status, inventory) =>
                    <Switch
                        className={
                            "inventory-status-" +
                            (status === RECORDSTATUS.ACTIVE
                                ? "active"
                                : "inactive")
                        }
                        checked={status === RECORDSTATUS.ACTIVE}
                        onChange={() => {
                            const { _id } = inventory;
                            updateInventoryStatus({
                                name: "UPDATEINVENTORYSTATUS",
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

        const expandedRowRender = inventory => {
            let { prices, baseUnit, basePrice } = inventory;
            let sortedPrices = [];
            sortedPrices.push({
                unit: baseUnit,
                price: basePrice,
                multiplier: 1
            });
            prices.forEach(price => sortedPrices.push(price));
            sortedPrices.sort(
                (price1, price2) => price1.multiplier - price2.multiplier
            );
            return (
                <div>
                    <Row>
                        <Col span={10}>
                            <Row>
                                <Col span={4}>
                                    {i18n.__("inventory-unit")}
                                </Col>
                                <Col span={8} offset={2}>
                                    {i18n.__("inventory-price")}
                                </Col>
                                <Col span={6} offset={2}>
                                    {i18n.__("inventory-multiplier")}
                                </Col>
                            </Row>
                            {sortedPrices.map((price, i) =>
                                <Row key={price.unit}>
                                    <Col span={4}>
                                        {price.unit}
                                    </Col>
                                    <Col span={8} offset={2}>
                                        <div>
                                            <span style={{ float: "left" }}>
                                                Rp
                                            </span>
                                            <NumberFormat
                                                value={price.price}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                                style={{ float: "right" }}
                                            />
                                        </div>
                                    </Col>
                                    <Col span={6} offset={2}>
                                        {i === 0
                                            ? price.multiplier +
                                              " " +
                                              price.unit
                                            : Math.ceil(
                                                  price.multiplier /
                                                      sortedPrices[i - 1]
                                                          .multiplier
                                              ) +
                                              " " +
                                              sortedPrices[i - 1].unit}
                                    </Col>
                                </Row>
                            )}
                        </Col>
                    </Row>
                </div>
            );
        };

        const tableProps = {
            error,
            columns,
            loading,
            expandedRowRender,
            bordered: true,
            dataSource: inventories,
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

InventoryList.propTypes = {
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default InventoryList;
