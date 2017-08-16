import { Button, Form, Icon, Input, InputNumber, Select, Table } from "antd";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class OrderFormItems extends Component {
    constructor() {
        super();
        this.addOrderItem = this.addOrderItem.bind(this);
        this.editOrderItem = this.editOrderItem.bind(this);
        this.removeOrderItem = this.removeOrderItem.bind(this);
        this.addOrderItem = this.addOrderItem.bind(this);
    }

    addOrderItem() {
        const { newOrderItemForm, editDisabled } = this.props;
        if (editDisabled) return;
        newOrderItemForm();
    }

    editOrderItem(itemId) {
        const { editOrderItemForm } = this.props;
        editOrderItemForm({ itemId });
    }

    removeOrderItem(itemId) {
        const { orderForm, editDisabled } = this.props;
        if (editDisabled) return;
        const { getFieldValue, setFieldsValue } = orderForm;
        const orderItems = getFieldValue("orderItems");
        setFieldsValue({
            orderItems: orderItems.filter(
                orderItem => orderItem.itemId !== itemId
            )
        });
    }

    render() {
        const { orderForm, editDisabled } = this.props;

        const { getFieldDecorator, getFieldValue } = orderForm;

        const orderItems = getFieldValue("orderItems") || [];

        const orderItemsDatasource = orderItems.map(orderItem => {
            const { itemId, item, itemPrices, discount } = orderItem;

            let totalQuantity = (itemPrices || []).reduce((sum, itemPrice) => {
                return sum + itemPrice.quantity * itemPrice.multiplier;
            }, 0);

            return {
                itemId: itemId,
                delete: (
                    <div>
                        {!editDisabled &&
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.removeOrderItem(itemId)}
                            />}
                    </div>
                ),
                itemName: (
                    <a onClick={() => this.editOrderItem(itemId)}>
                        {item.name}
                    </a>
                ),
                quantity: (
                    <span>
                        {item.allPrices.reduce((quantityStr, itemPrice) => {
                            if (totalQuantity >= itemPrice.multiplier) {
                                let currentQuantity = Math.floor(
                                    totalQuantity / itemPrice.multiplier
                                );
                                totalQuantity %= itemPrice.multiplier;
                                return quantityStr.concat(
                                    `${currentQuantity} ${itemPrice.unit}`
                                );
                            }
                            return quantityStr;
                        }, "")}
                    </span>
                ),
                subTotal: (
                    <span>
                        {(itemPrices || []).reduce((sum, itemPrice) => {
                            return sum + itemPrice.quantity * itemPrice.price;
                        }, 0)}
                    </span>
                ),
                discount: (
                    <span>
                        {(itemPrices || []).reduce((sum, itemPrice) => {
                            return sum + itemPrice.discount;
                        }, discount)}
                    </span>
                ),
                total: (
                    <span>
                        {(itemPrices || []).reduce((sum, itemPrice) => {
                            return (
                                sum +
                                (itemPrice.quantity * itemPrice.price -
                                    itemPrice.discount)
                            );
                        }, -discount)}
                    </span>
                )
            };
        });

        const orderPricesTableProps = {
            rowKey: "itemId",
            pagination: false,
            dataSource: orderItemsDatasource,
            columns: [
                {
                    title: i18n.__("order-itemName"),
                    dataIndex: "itemName",
                    key: "itemName",
                    width: "20%"
                },
                {
                    title: i18n.__("order-quantity"),
                    dataIndex: "quantity",
                    key: "quantity",
                    width: "10%"
                },
                {
                    title: i18n.__("order-subTotal"),
                    dataIndex: "subTotal",
                    key: "subTotal",
                    width: "20%"
                },
                {
                    title: i18n.__("order-discount"),
                    dataIndex: "discount",
                    key: "discount",
                    width: "20%"
                },
                {
                    title: i18n.__("order-total"),
                    dataIndex: "total",
                    key: "total",
                    width: "20%"
                },
                {
                    dataIndex: "delete",
                    key: "delete",
                    width: "10%"
                }
            ],
            scroll: { y: 100 }
        };

        return (
            <div>
                <Button
                    disabled={editDisabled}
                    type="dashed"
                    onClick={this.addOrderItem}
                    style={{ width: "60%" }}
                >
                    <Icon type="plus" />
                    {i18n.__("order-add-item-price")}
                </Button>
                <Table
                    className="order-form-price-table"
                    {...orderPricesTableProps}
                />
                <span>
                    {orderItems.reduce((sum, orderItem) => {
                        return (orderItem.itemPrices || [])
                            .reduce((sum, itemPrice) => {
                                return (
                                    sum + itemPrice.quantity * itemPrice.price
                                );
                            }, sum);
                    }, 0)}
                </span>
                <br />
                <span>
                    {orderItems.reduce((sum, orderItem) => {
                        return (
                            (orderItem.itemPrices || [])
                                .reduce((sum, itemPrice) => {
                                    return sum + itemPrice.discount;
                                }, sum) + orderItem.discount
                        );
                    }, 0)}
                </span>
                <br />
                <span>
                    {orderItems.reduce((sum, orderItem) => {
                        return (
                            (orderItem.itemPrices || [])
                                .reduce((sum, itemPrice) => {
                                    return (
                                        sum +
                                        itemPrice.quantity * itemPrice.price -
                                        itemPrice.discount
                                    );
                                }, sum) - orderItem.discount
                        );
                    }, 0)}
                </span>
            </div>
        );
    }
}

OrderFormItems.propTypes = {};

export default OrderFormItems;
