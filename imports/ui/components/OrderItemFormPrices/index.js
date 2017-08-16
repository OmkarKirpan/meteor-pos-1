import { Button, Form, Icon, Input, InputNumber, Select, Table } from "antd";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class OrderItemFormPrices extends Component {
    constructor() {
        super();
        this.addItemPrice = this.addItemPrice.bind(this);
        this.removeItemPrice = this.removeItemPrice.bind(this);
        this.onItemPriceSelected = this.onItemPriceSelected.bind(this);
        this.checkDuplicateUnits = this.checkDuplicateUnits.bind(this);
    }

    addItemPrice() {
        const { orderItemForm, editDisabled } = this.props;
        if (editDisabled) return;
        const { getFieldValue, setFieldsValue } = orderItemForm;
        if (!getFieldValue("item")) return;
        const itemPrices = getFieldValue("itemPrices");
        const itemPriceCount = getFieldValue("itemPriceCount");
        setFieldsValue({
            itemPriceCount: itemPriceCount + 1,
            itemPrices: itemPrices.concat({ itemPriceId: itemPriceCount })
        });
    }

    removeItemPrice(itemPriceId) {
        const { orderItemForm, editDisabled } = this.props;
        if (editDisabled) return;
        const { getFieldValue, setFieldsValue } = orderItemForm;
        const itemPrices = getFieldValue("itemPrices");
        setFieldsValue({
            itemPrices: itemPrices.filter(
                itemPrice => itemPrice.itemPriceId !== itemPriceId
            )
        });
    }

    onItemPriceSelected(itemPriceUnit, itemPriceOption) {
        if (!itemPriceOption) return;
        const { orderItemForm } = this.props;
        const { itemPrice, itemPriceId } = itemPriceOption.props;
        orderItemForm.setFieldsValue({
            [`itemPrice-${itemPriceId}-multiplier`]: itemPrice.multiplier,
            [`itemPrice-${itemPriceId}-price`]: itemPrice.price,
            [`itemPrice-${itemPriceId}-quantity`]: 0,
            [`itemPrice-${itemPriceId}-discount`]: 0
        });
    }

    checkDuplicateUnits(rule, unit, callback) {
        const { orderItemForm } = this.props;
        const itemPrices = orderItemForm.getFieldValue("itemPrices") || [];
        let duplicateUnitCount = 0;
        itemPrices.forEach(itemPrice => {
            const { itemPriceId } = itemPrice;
            duplicateUnitCount +=
                orderItemForm.getFieldValue(`itemPrice-${itemPriceId}-unit`) ===
                unit
                    ? 1
                    : 0;
        });
        if (duplicateUnitCount === 1) callback();
        else callback(new Error("duplicated"));
    }

    render() {
        const { orderItemForm, editDisabled } = this.props;

        const { getFieldDecorator, getFieldValue } = orderItemForm;

        const itemPrices = getFieldValue("itemPrices");

        const selectedItem = getFieldValue("item");

        const itemPricesDatasource = (itemPrices || []).map(itemPrice => {
            const { itemPriceId } = itemPrice;
            return {
                itemPriceId,
                delete: (
                    <div>
                        {!editDisabled &&
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() =>
                                    this.removeItemPrice(itemPriceId)}
                            />}
                    </div>
                ),
                unit: (
                    <Form.Item className="order-form-order">
                        {getFieldDecorator(`itemPrice-${itemPriceId}-unit`, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "order-required-field-unit"
                                    )
                                },
                                {
                                    validator: this.checkDuplicateUnits
                                }
                            ]
                        })(
                            <Select
                                disabled={editDisabled}
                                placeholder={i18n.__("item-brand-placeholder")}
                                mode="combobox"
                                notFoundContent=""
                                optionLabelProp="text"
                                defaultActiveFirstOption={false}
                                filterOption={false}
                                onSelect={this.onItemPriceSelected}
                                test={itemPriceId}
                            >
                                {((selectedItem && selectedItem.allPrices) ||
                                    [])
                                    .map(itemPrice =>
                                        <Select.Option
                                            key={itemPrice.unit}
                                            text={`${itemPrice.unit} - ${itemPrice.price}`}
                                            itemPrice={itemPrice}
                                            itemPriceId={itemPriceId}
                                        >
                                            <span>
                                                {itemPrice.unit}
                                            </span>
                                        </Select.Option>
                                    )}
                            </Select>
                        )}
                    </Form.Item>
                ),
                multiplier: (
                    <Form.Item className="order-form-order">
                        {getFieldDecorator(
                            `itemPrice-${itemPriceId}-multiplier`,
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: i18n.__(
                                            "order-required-field-unit"
                                        )
                                    }
                                ]
                            }
                        )(<InputNumber disabled style={{ width: "100%" }} />)}
                    </Form.Item>
                ),
                price: (
                    <Form.Item className="order-form-order">
                        {getFieldDecorator(`itemPrice-${itemPriceId}-price`, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "order-required-field-price"
                                    )
                                }
                            ]
                        })(<InputNumber disabled style={{ width: "100%" }} />)}
                    </Form.Item>
                ),
                quantity: (
                    <Form.Item className="orderItem-${orderItemId}-discount">
                        {getFieldDecorator(
                            `itemPrice-${itemPriceId}-quantity`,
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: i18n.__(
                                            "order-required-field-multiplier"
                                        )
                                    }
                                ]
                            }
                        )(
                            <InputNumber
                                disabled={editDisabled}
                                style={{ width: "100%" }}
                            />
                        )}
                    </Form.Item>
                ),
                discount: (
                    <Form.Item className="orderItem-${orderItemId}-discount">
                        {getFieldDecorator(
                            `itemPrice-${itemPriceId}-discount`,
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: i18n.__(
                                            "order-required-field-multiplier"
                                        )
                                    }
                                ]
                            }
                        )(
                            <InputNumber
                                disabled={editDisabled}
                                style={{ width: "100%" }}
                            />
                        )}
                    </Form.Item>
                )
            };
        });

        const orderPricesTableProps = {
            rowKey: "itemPriceId",
            pagination: false,
            dataSource: itemPricesDatasource,
            columns: [
                {
                    title: i18n.__("order-unit"),
                    dataIndex: "unit",
                    key: "unit",
                    width: "20%"
                },
                {
                    title: i18n.__("order-multiplier"),
                    dataIndex: "multiplier",
                    key: "multiplier",
                    width: "10%"
                },
                {
                    title: i18n.__("order-price"),
                    dataIndex: "price",
                    key: "price",
                    width: "20%"
                },
                {
                    title: i18n.__("order-quantity"),
                    dataIndex: "quantity",
                    key: "quantity",
                    width: "10%"
                },
                {
                    title: i18n.__("order-discount"),
                    dataIndex: "discount",
                    key: "discount",
                    width: "20%"
                },
                {
                    dataIndex: "delete",
                    key: "delete",
                    width: "20%"
                }
            ],
            scroll: { y: 100 }
        };

        return (
            <div>
                <Table
                    className="order-form-price-table"
                    {...orderPricesTableProps}
                />
                <Button
                    type="dashed"
                    onClick={this.addItemPrice}
                    disabled={!selectedItem || editDisabled}
                    style={{ width: "60%" }}
                >
                    <Icon type="plus" />
                    {i18n.__("order-add-item-price")}
                </Button>
            </div>
        );
    }
}

OrderItemFormPrices.propTypes = {
    orderItemForm: PropTypes.object.isRequired
};

export default OrderItemFormPrices;
