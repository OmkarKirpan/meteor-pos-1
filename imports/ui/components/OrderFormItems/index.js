import "./index.scss";

import {
    Button,
    Col,
    Form,
    Icon,
    Input,
    InputNumber,
    Row,
    Select,
    Table
} from "antd";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import { formatCurrency } from "../../../util/currency";
import i18n from "meteor/universe:i18n";

class OrderFormItems extends Component {
    constructor() {
        super();
        this.addOrderItem = this.addOrderItem.bind(this);
        this.editOrderItem = this.editOrderItem.bind(this);
        this.removeOrderItem = this.removeOrderItem.bind(this);
        this.validateOrderItems = this.validateOrderItems.bind(this);
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

    validateOrderItems(rule, _, callback) {
        const { orderForm } = this.props;
        const { getFieldValue } = orderForm;
        const orderItems = getFieldValue("orderItems");
        if (!orderItems || orderItems.length <= 0)
            callback(new Error(i18n.__("order-items-required")));
        else callback();
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
                                class="order-form-item-delete-button"
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
                                    `${currentQuantity} ${itemPrice.unit} `
                                );
                            }
                            return quantityStr;
                        }, "")}
                    </span>
                ),
                subTotal: (
                    <span>
                        {formatCurrency(
                            (itemPrices || []).reduce((sum, itemPrice) => {
                                return (
                                    sum + itemPrice.quantity * itemPrice.price
                                );
                            }, 0)
                        )}
                    </span>
                ),
                discount: (
                    <span>
                        {formatCurrency(
                            (itemPrices || []).reduce((sum, itemPrice) => {
                                return (
                                    sum +
                                    itemPrice.discount * itemPrice.quantity
                                );
                            }, discount)
                        )}
                    </span>
                ),
                total: (
                    <span>
                        {formatCurrency(
                            (itemPrices || []).reduce((sum, itemPrice) => {
                                return (
                                    sum +
                                    (itemPrice.quantity * itemPrice.price -
                                        itemPrice.discount)
                                );
                            }, -discount)
                        )}
                    </span>
                )
            };
        });

        const orderItemsTableProps = {
            title: () =>
                <Form.Item>
                    {getFieldDecorator("orderItems", {
                        rules: [
                            {
                                validator: this.validateOrderItems
                            }
                        ]
                    })(
                        <span>
                            {i18n.__("order-items")}
                        </span>
                    )}
                </Form.Item>,
            rowKey: "itemId",
            pagination: false,
            dataSource: orderItemsDatasource,
            columns: [
                {
                    title: i18n.__("order-item-name"),
                    dataIndex: "itemName",
                    key: "itemName",
                    width: "20%"
                },
                {
                    title: i18n.__("order-item-quantity"),
                    dataIndex: "quantity",
                    key: "quantity",
                    width: "15%"
                },
                {
                    title: i18n.__("order-item-subTotal"),
                    dataIndex: "subTotal",
                    key: "subTotal",
                    width: "20%"
                },
                {
                    title: i18n.__("order-item-discount"),
                    dataIndex: "discount",
                    key: "discount",
                    width: "20%"
                },
                {
                    title: i18n.__("order-item-total"),
                    dataIndex: "total",
                    key: "total",
                    width: "20%"
                },
                {
                    dataIndex: "delete",
                    key: "delete",
                    width: "5%"
                }
            ],
            scroll: { y: 100 },
            locale: {
                emptyText: i18n.__("no-data")
            }
        };

        const leftTotalsProps = {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12
        };

        const rightTotalProps = {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12
        };

        return (
            <div>
                <Table {...orderItemsTableProps} />
                <Button
                    className="order-items-add-button"
                    disabled={editDisabled}
                    type="dashed"
                    onClick={this.addOrderItem}
                >
                    <Icon type="plus" />
                    {i18n.__("order-items-add")}
                </Button>
                <Row>
                    <Col {...leftTotalsProps}>
                        <span>Sub total</span>
                    </Col>
                    <Col {...rightTotalProps}>
                        {formatCurrency(
                            orderItems.reduce((sum, orderItem) => {
                                return (orderItem.itemPrices || [])
                                    .reduce((sum, itemPrice) => {
                                        return (
                                            sum +
                                            itemPrice.quantity * itemPrice.price
                                        );
                                    }, sum);
                            }, 0)
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col {...leftTotalsProps}>
                        <span>Total discount</span>
                    </Col>
                    <Col {...rightTotalProps}>
                        {formatCurrency(
                            orderItems.reduce((sum, orderItem) => {
                                return (
                                    (orderItem.itemPrices || [])
                                        .reduce((sum, itemPrice) => {
                                            return (
                                                sum +
                                                itemPrice.discount *
                                                    itemPrice.quantity
                                            );
                                        }, sum) + orderItem.discount
                                );
                            }, 0)
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col {...leftTotalsProps}>
                        <span>Total</span>
                    </Col>
                    <Col {...rightTotalProps}>
                        {formatCurrency(
                            orderItems.reduce((sum, orderItem) => {
                                return (
                                    (orderItem.itemPrices || [])
                                        .reduce((sum, itemPrice) => {
                                            return (
                                                sum +
                                                itemPrice.quantity *
                                                    (itemPrice.price -
                                                        itemPrice.discount)
                                            );
                                        }, sum) - orderItem.discount
                                );
                            }, 0)
                        )}
                    </Col>
                </Row>
            </div>
        );
    }
}

OrderFormItems.propTypes = {};

export default OrderFormItems;
