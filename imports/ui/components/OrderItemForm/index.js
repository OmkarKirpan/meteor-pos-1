import {
    Button,
    Form,
    Icon,
    Input,
    InputNumber,
    Modal,
    Select,
    Table
} from "antd";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import { ENTITYSTATUS } from "../../../constants";
import OrderItemFormPrices from "../OrderItemFormPrices";
import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class OrderItemForm extends Component {
    constructor() {
        super();
        this.saveOrderItem = this.saveOrderItem.bind(this);
        this.onOk = this.onOk.bind(this);
        this.onItemSelected = this.onItemSelected.bind(this);
        this.onSearchItems = this.onSearchItems.bind(this);
        this.validateItem = this.validateItem.bind(this);
    }

    saveOrderItem(orderItem) {
        const { orderForm, isNew } = this.props;
        let orderItems = orderForm.getFieldValue("orderItems") || [];
        let existingOrderItemIdx = orderItems.findIndex(
            existingOrderItem => existingOrderItem.itemId === orderItem.itemId
        );

        if (!isNew && existingOrderItemIdx >= 0) {
            orderItems[existingOrderItemIdx] = orderItem;
        } else if (existingOrderItemIdx >= 0) {
            let existingOrderItemPrices =
                orderItems[existingOrderItemIdx].itemPrices;

            orderItem.itemPrices.forEach(itemPrice => {
                let existingOrderItemPriceIdx = existingOrderItemPrices.findIndex(
                    existingOrderItemPrice =>
                        existingOrderItemPrice.unit === itemPrice.unit &&
                        existingOrderItemPrice.discount === itemPrice.discount
                );

                if (existingOrderItemPriceIdx >= 0) {
                    existingOrderItemPrices[
                        existingOrderItemPriceIdx
                    ].quantity +=
                        itemPrice.quantity;
                } else {
                    existingOrderItemPrices = existingOrderItemPrices.concat(
                        itemPrice
                    );
                    existingOrderItemPrices.sort(
                        (itemPrice1, itemPrice2) =>
                            itemPrice1.multiplier - itemPrice2.multiplier
                    );
                }
            });

            orderItems[
                existingOrderItemIdx
            ].itemPrices = existingOrderItemPrices;
        } else {
            orderItems = orderItems.concat(orderItem);
            orderItems.sort((orderItem1, orderItem2) => {
                if (orderItem1.item.name > orderItem2.item.name) return 1;
                if (orderItem1.item.name < orderItem2.item.name) return -1;
                return 0;
            });
        }

        orderForm.setFieldsValue({
            orderItems
        });
    }

    onItemSelected(itemId, itemOption) {
        if (!itemOption) return;
        const { form } = this.props;
        const { setFieldsValue } = form;
        const { item } = itemOption.props;
        setFieldsValue({
            item,
            itemPrices: []
        });
    }

    onSearchItems(searchText) {
        const { searchOrderItems, client } = this.props;
        const filter = {
            name: searchText,
            entityStatus: ENTITYSTATUS.ACTIVE
        };
        searchOrderItems({ client, filter });
    }

    validateItem(rule, itemId, callback) {
        const { form } = this.props;
        const { getFieldValue } = form;
        const selectedItem = getFieldValue("item");
        if (selectedItem && selectedItem._id === itemId) callback();
        else callback(new Error());
    }

    onOk() {
        const { form, client, closeOrderItemForm } = this.props;
        form.validateFields((errors, orderItem) => {
            if (!errors) {
                try {
                    const itemPriceData =
                        form.getFieldValue("itemPrices") || [];
                    const itemPrices = itemPriceData.map(({ itemPriceId }) => {
                        return {
                            itemPriceId,
                            quantity:
                                orderItem[`itemPrice-${itemPriceId}-quantity`],
                            unit: orderItem[`itemPrice-${itemPriceId}-unit`],
                            price: orderItem[`itemPrice-${itemPriceId}-price`],
                            discount:
                                orderItem[`itemPrice-${itemPriceId}-discount`],
                            multiplier:
                                orderItem[`itemPrice-${itemPriceId}-multiplier`]
                        };
                    });
                    this.saveOrderItem({
                        itemId: orderItem.itemId,
                        item: orderItem.item,
                        discount: orderItem.discount,
                        itemPrices
                    });
                } finally {
                    closeOrderItemForm();
                }
            }
        });
    }

    render() {
        const {
            form,
            visible,
            items,
            closeOrderItemForm,
            isNew,
            editDisabled
        } = this.props;

        const { getFieldDecorator, getFieldValue } = form;

        getFieldDecorator("item");
        getFieldDecorator("itemPrices");
        getFieldDecorator("itemPriceCount");

        const modalProps = {
            title: i18n.__("Order Item"),
            visible,
            onCancel: closeOrderItemForm,
            okText: i18n.__("order-item-save"),
            cancelText: i18n.__("cancel"),
            onOk: this.onOk,
            width: "50%",
            maskClosable: false
        };

        if (editDisabled) modalProps.footer = [];

        const itemPrices = getFieldValue("itemPrices");

        const itemOptions = items.map(item =>
            <Select.Option key={item._id} text={item.name} item={item}>
                <span>
                    {item.name}
                </span>
            </Select.Option>
        );

        const orderItemFormPricesProps = {
            orderItemForm: form,
            editDisabled
        };

        const formItemProps = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 }
        };

        return (
            <Modal {...modalProps}>
                <Form onSubmit={this.onOk}>
                    <Form.Item
                        {...formItemProps}
                        label={i18n.__("order-item")}
                        hasFeedback
                    >
                        {getFieldDecorator("itemId", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__("order-item-required"),
                                    validator: this.validateItem
                                }
                            ]
                        })(
                            <Select
                                disabled={!isNew}
                                placeholder={i18n.__("order-item-placeholder")}
                                mode="combobox"
                                notFoundContent=""
                                optionLabelProp="text"
                                defaultActiveFirstOption={false}
                                filterOption={false}
                                onSearch={this.onSearchItems}
                                onSelect={this.onItemSelected}
                            >
                                {itemOptions}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemProps}
                        label={i18n.__("order-item-discount")}
                        hasFeedback
                    >
                        {getFieldDecorator("discount", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "order-item-discount-required"
                                    )
                                },
                                {
                                    message: i18n.__(
                                        "order-item-discount-invalid"
                                    ),
                                    validator: (_, value, callback) => {
                                        value === undefined || value >= 0
                                            ? callback()
                                            : callback(new Error());
                                    }
                                }
                            ]
                        })(
                            <InputNumber
                                disabled={editDisabled}
                                style={{ width: "100%" }}
                                formatter={value =>
                                    `Rp ${value
                                        .toString()
                                        .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )}`}
                                parser={value =>
                                    value.toString().replace(/Rp\s?|(,*)/g, "")}
                                placeholder={i18n.__(
                                    "order-item-discount-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <OrderItemFormPrices {...orderItemFormPricesProps} />
                </Form>
            </Modal>
        );
    }
}

OrderItemForm.propTypes = {
    changeOrderItemForm: PropTypes.func.isRequired
};

const mapPropsToFields = ({ editingOrderItem }) => {
    const {
        itemId,
        item,
        discount,
        itemPrices,
        itemPriceCount
    } = editingOrderItem;

    const itemPriceData = {};

    if (itemPrices) {
        itemPrices.forEach(itemPrice => {
            const {
                itemPriceId,
                unit,
                quantity,
                price,
                discount,
                multiplier
            } = itemPrice;
            itemPriceData[`itemPrice-${itemPriceId}-unit`] = {
                value: editingOrderItem[`itemPrice-${itemPriceId}-unit`] || unit
            };
            itemPriceData[`itemPrice-${itemPriceId}-quantity`] = {
                value:
                    editingOrderItem[`itemPrice-${itemPriceId}-quantity`] !==
                    undefined
                        ? editingOrderItem[`itemPrice-${itemPriceId}-quantity`]
                        : quantity
            };
            itemPriceData[`itemPrice-${itemPriceId}-price`] = {
                value:
                    editingOrderItem[`itemPrice-${itemPriceId}-price`] !==
                    undefined
                        ? editingOrderItem[`itemPrice-${itemPriceId}-price`]
                        : price
            };
            itemPriceData[`itemPrice-${itemPriceId}-discount`] = {
                value:
                    editingOrderItem[`itemPrice-${itemPriceId}-discount`] !==
                    undefined
                        ? editingOrderItem[`itemPrice-${itemPriceId}-discount`]
                        : discount
            };
            itemPriceData[`itemPrice-${itemPriceId}-multiplier`] = {
                value:
                    editingOrderItem[`itemPrice-${itemPriceId}-multiplier`] !==
                    undefined
                        ? editingOrderItem[
                              `itemPrice-${itemPriceId}-multiplier`
                          ]
                        : multiplier
            };
        });
    }

    return {
        itemId: {
            value: itemId
        },
        item: {
            value: item
        },
        itemPrices: {
            value: itemPrices
        },
        itemPriceCount: {
            value: itemPriceCount
        },
        discount: {
            value: discount
        },
        ...itemPriceData
    };
};

const onValuesChange = (props, orderItem) => {
    const { changeOrderItemForm } = props;
    changeOrderItemForm({ orderItem });
};

export default Form.create({ mapPropsToFields, onValuesChange })(OrderItemForm);
