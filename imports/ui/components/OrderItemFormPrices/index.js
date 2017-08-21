import "./index.scss";

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
        this.validateItemPrices = this.validateItemPrices.bind(this);
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
        if (unit === undefined) callback();
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
        if (duplicateUnitCount <= 1) callback();
        else
            callback(
                new Error(i18n.__("order-item-itemPrice-unit-duplicated"))
            );
    }

    validateItemPrices(rule, _, callback) {
        const { orderItemForm } = this.props;
        const { getFieldValue } = orderItemForm;
        const itemPrices = getFieldValue("itemPrices");
        if (!itemPrices || itemPrices.length <= 0)
            callback(new Error(i18n.__("order-item-itemPrices-required")));
        else callback();
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
                                className="order-item-price-delete-button"
                                type="minus-circle-o"
                                onClick={() =>
                                    this.removeItemPrice(itemPriceId)}
                            />}
                    </div>
                ),
                unit: (
                    <Form.Item>
                        {getFieldDecorator(`itemPrice-${itemPriceId}-unit`, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "order-item-itemPrice-unit-required"
                                    )
                                },
                                {
                                    validator: this.checkDuplicateUnits
                                }
                            ]
                        })(
                            <Select
                                disabled={editDisabled}
                                placeholder={i18n.__(
                                    "order-item-itemPrice-unit-placeholder"
                                )}
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
                                            text={`${itemPrice.unit}`}
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
                    <Form.Item>
                        {getFieldDecorator(
                            `itemPrice-${itemPriceId}-multiplier`,
                            {
                                rules: []
                            }
                        )(
                            <InputNumber
                                placeholder={i18n.__(
                                    "order-item-itemPrice-multiplier-placeholder"
                                )}
                                disabled
                                style={{ width: "100%" }}
                            />
                        )}
                    </Form.Item>
                ),
                price: (
                    <Form.Item>
                        {getFieldDecorator(`itemPrice-${itemPriceId}-price`, {
                            rules: []
                        })(
                            <InputNumber
                                placeholder={i18n.__(
                                    "order-item-itemPrice-price-placeholder"
                                )}
                                formatter={value =>
                                    `Rp ${value
                                        .toString()
                                        .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )}`}
                                parser={value =>
                                    value.toString().replace(/Rp\s?|(,*)/g, "")}
                                disabled
                                style={{ width: "100%" }}
                            />
                        )}
                    </Form.Item>
                ),
                quantity: (
                    <Form.Item>
                        {getFieldDecorator(
                            `itemPrice-${itemPriceId}-quantity`,
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: i18n.__(
                                            "order-item-itemPrice-quantity-required"
                                        )
                                    },
                                    {
                                        message: i18n.__(
                                            "order-item-itemPrice-quantity-invalid"
                                        ),
                                        validator: (_, value, callback) => {
                                            value === undefined || value > 0
                                                ? callback()
                                                : callback(new Error());
                                        }
                                    }
                                ]
                            }
                        )(
                            <InputNumber
                                placeholder={i18n.__(
                                    "order-item-itemPrice-quantity-placeholder"
                                )}
                                disabled={editDisabled}
                                style={{ width: "100%" }}
                            />
                        )}
                    </Form.Item>
                ),
                discount: (
                    <Form.Item>
                        {getFieldDecorator(
                            `itemPrice-${itemPriceId}-discount`,
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: i18n.__(
                                            "order-item-itemPrice-discount-required"
                                        )
                                    },
                                    {
                                        message: i18n.__(
                                            "order-item-itemPrice-discount-invalid"
                                        ),
                                        validator: (_, value, callback) => {
                                            value === undefined || value >= 0
                                                ? callback()
                                                : callback(new Error());
                                        }
                                    }
                                ]
                            }
                        )(
                            <InputNumber
                                placeholder={i18n.__(
                                    "order-item-itemPrice-discount-placeholder"
                                )}
                                formatter={value =>
                                    `Rp ${value
                                        .toString()
                                        .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )}`}
                                parser={value =>
                                    value.toString().replace(/Rp\s?|(,*)/g, "")}
                                disabled={editDisabled}
                                style={{ width: "100%" }}
                            />
                        )}
                    </Form.Item>
                )
            };
        });

        const orderPricesTableProps = {
            title: () =>
                <Form.Item>
                    {getFieldDecorator("itemPrices", {
                        rules: [
                            {
                                validator: this.validateItemPrices
                            }
                        ]
                    })(<div />)}
                </Form.Item>,
            rowKey: "itemPriceId",
            pagination: false,
            dataSource: itemPricesDatasource,
            columns: [
                {
                    title: i18n.__("order-item-itemPrice-unit"),
                    dataIndex: "unit",
                    key: "unit",
                    width: "25%"
                },
                {
                    title: i18n.__("order-item-itemPrice-multiplier"),
                    dataIndex: "multiplier",
                    key: "multiplier",
                    width: "10%"
                },
                {
                    title: i18n.__("order-item-itemPrice-price"),
                    dataIndex: "price",
                    key: "price",
                    width: "20%"
                },
                {
                    title: i18n.__("order-item-itemPrice-quantity"),
                    dataIndex: "quantity",
                    key: "quantity",
                    width: "20%"
                },
                {
                    title: i18n.__("order-item-itemPrice-discount"),
                    dataIndex: "discount",
                    key: "discount",
                    width: "20%"
                },
                {
                    dataIndex: "delete",
                    key: "delete",
                    width: "5%"
                }
            ],
            scroll: { y: 200 },
            locale: {
                emptyText: i18n.__("no-data")
            }
        };

        return (
            <div>
                <Table {...orderPricesTableProps} />
                <Button
                    className="order-item-itemPrices-add-button"
                    type="dashed"
                    onClick={this.addItemPrice}
                    disabled={!selectedItem || editDisabled}
                >
                    <Icon type="plus" />
                    {i18n.__("order-item-itemPrices-add")}
                </Button>
            </div>
        );
    }
}

OrderItemFormPrices.propTypes = {
    orderItemForm: PropTypes.object.isRequired
};

export default OrderItemFormPrices;
