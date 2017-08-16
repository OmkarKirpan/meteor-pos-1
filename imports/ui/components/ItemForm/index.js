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
import { CREATEITEM, UPDATEITEM } from "../../graphql/mutations/item";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import ItemFormPrices from "../ItemFormPrices";
import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@graphql(CREATEITEM, {
    name: "createItem"
})
@graphql(UPDATEITEM, {
    name: "updateItem"
})
@compose(withApollo)
class ItemForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
        this.onSearchCategories = this.onSearchCategories.bind(this);
        this.onSearchBrands = this.onSearchBrands.bind(this);
    }

    onOk() {
        const {
            form,
            client,
            createItem,
            updateItem,
            isNew,
            closeItemForm
        } = this.props;

        form.validateFields((errors, item) => {
            if (!errors) {
                const itemPrices = form.getFieldValue("itemPrices");
                const itemPriceIds = itemPrices.map(
                    itemPrice => itemPrice.itemPriceId
                );
                const itemPricesData = itemPriceIds.map(itemPriceId => {
                    return {
                        unit: item[`itemPrice-${itemPriceId}-unit`],
                        price: item[`itemPrice-${itemPriceId}-price`],
                        multiplier: item[`itemPrice-${itemPriceId}-multiplier`]
                    };
                });

                const itemData = {
                    _id: item._id,
                    brandId: item.brandId,
                    categoryId: item.categoryId,
                    name: item.name,
                    basePrice: item.basePrice,
                    baseUnit: item.baseUnit,
                    itemPrices: itemPricesData
                };

                const mutation = isNew
                    ? props => {
                          return createItem(props);
                      }
                    : props => {
                          return updateItem(props);
                      };
                mutation({
                    variables: {
                        item: itemData
                    }
                }).then(() => closeItemForm());
            }
        });
    }

    onSearchCategories(searchText) {
        const { searchItemCategories, client } = this.props;
        const filter = {
            name: searchText
        };
        searchItemCategories({ client, filter });
    }

    onSearchBrands(searchText) {
        const { searchItemBrands, client } = this.props;
        const filter = {
            name: searchText
        };
        searchItemBrands({ client, filter });
    }

    render() {
        const {
            form,
            visible,
            categories,
            brands,
            closeItemForm,
            isNew
        } = this.props;

        const { getFieldDecorator, getFieldValue } = form;

        getFieldDecorator("itemPrices");
        getFieldDecorator("priceCount");

        const modalProps = {
            title: i18n.__(isNew ? "item-add" : "item-update"),
            visible,
            onCancel: closeItemForm,
            okText: i18n.__(isNew ? "create" : "update"),
            cancelText: i18n.__("cancel"),
            onOk: this.onOk,
            width: 400,
            maskClosable: false
        };

        const categoryOptions = categories.map(category =>
            <Select.Option key={category._id} text={category.name}>
                <span>
                    {category.name}
                </span>
            </Select.Option>
        );

        const brandOptions = brands.map(brand =>
            <Select.Option key={brand._id} text={brand.name}>
                <span>
                    {brand.name}
                </span>
            </Select.Option>
        );

        return (
            <Modal {...modalProps}>
                <Form onSubmit={this.onOk}>
                    <Form.Item className="item-form-item">
                        {getFieldDecorator("_id")(
                            <Input style={{ display: "none" }} />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="item-form-item"
                        label={i18n.__("item-name")}
                        hasFeedback
                    >
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__("item-required-field-name")
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__("item-name-placeholder")}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="item-form-item"
                        label={i18n.__("item-brand")}
                        hasFeedback
                    >
                        {getFieldDecorator("brandId", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "item-required-field-brand"
                                    )
                                }
                            ]
                        })(
                            <Select
                                placeholder={i18n.__("item-brand-placeholder")}
                                mode="combobox"
                                notFoundContent=""
                                optionLabelProp="text"
                                defaultActiveFirstOption={false}
                                filterOption={false}
                                onSearch={this.onSearchBrands}
                            >
                                {brandOptions}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        className="item-form-item"
                        label={i18n.__("item-category")}
                        hasFeedback
                    >
                        {getFieldDecorator("categoryId", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "item-required-field-category"
                                    )
                                }
                            ]
                        })(
                            <Select
                                placeholder={i18n.__(
                                    "item-category-placeholder"
                                )}
                                mode="combobox"
                                notFoundContent=""
                                optionLabelProp="text"
                                defaultActiveFirstOption={false}
                                filterOption={false}
                                onSearch={this.onSearchCategories}
                            >
                                {categoryOptions}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        className="item-form-item"
                        label={i18n.__("item-unit")}
                        hasFeedback
                    >
                        {getFieldDecorator("baseUnit", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__("item-required-field-unit")
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__("item-unit-placeholder")}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="item-form-item"
                        label={i18n.__("item-price")}
                        hasFeedback
                    >
                        {getFieldDecorator("basePrice", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "item-required-field-price"
                                    )
                                }
                            ]
                        })(
                            <InputNumber
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
                                placeholder={i18n.__("item-price-placeholder")}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="item-form-item"
                        label={i18n.__("item-stock")}
                        hasFeedback
                    >
                        {getFieldDecorator("stock")(
                            <InputNumber
                                disabled
                                style={{ width: "100%" }}
                                placeholder={i18n.__("item-stock-placeholder")}
                            />
                        )}
                    </Form.Item>
                    <ItemFormPrices itemForm={form} />
                </Form>
            </Modal>
        );
    }
}

ItemForm.propTypes = {
    visible: PropTypes.bool.isRequired
};

const mapPropsToFields = ({ editingItem }) => {
    const {
        _id,
        brandId,
        categoryId,
        name,
        basePrice,
        baseUnit,
        stock,
        itemPrices,
        itemPriceMap,
        priceCount
    } = editingItem;

    let itemPriceData = {};

    if (itemPrices) {
        itemPrices.forEach(itemPrice => {
            const { itemPriceId, unit, multiplier, price } = itemPrice;
            itemPriceData[`itemPrice-${itemPriceId}-unit`] = {
                value: editingItem[`itemPrice-${itemPriceId}-unit`] || unit
            };
            itemPriceData[`itemPrice-${itemPriceId}-multiplier`] = {
                value:
                    editingItem[`itemPrice-${itemPriceId}-multiplier`] ||
                    multiplier
            };
            itemPriceData[`itemPrice-${itemPriceId}-price`] = {
                value: editingItem[`itemPrice-${itemPriceId}-price`] || price
            };
        });
    }

    return {
        _id: {
            value: _id
        },
        categoryId: {
            value: categoryId
        },
        brandId: {
            value: brandId
        },
        name: {
            value: name
        },
        basePrice: {
            value: basePrice
        },
        baseUnit: {
            value: baseUnit
        },
        stock: {
            value: stock
        },
        itemPrices: {
            value: itemPrices
        },
        priceCount: {
            value: priceCount
        },
        ...itemPriceData
    };
};

const onValuesChange = (props, item) => {
    const { changeItemForm } = props;
    changeItemForm({ item });
};

export default Form.create({ mapPropsToFields, onValuesChange })(ItemForm);
