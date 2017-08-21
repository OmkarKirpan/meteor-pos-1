import "./index.scss";

import {
    Button,
    Col,
    Form,
    Icon,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Table
} from "antd";
import { CREATEITEM, UPDATEITEM } from "../../graphql/mutations/item";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import { ENTITYSTATUS } from "../../../constants";
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
        this.onCategorySelected = this.onCategorySelected.bind(this);
        this.onBrandSelected = this.onBrandSelected.bind(this);
        this.validateCategory = this.validateCategory.bind(this);
        this.validateBrand = this.validateBrand.bind(this);
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
                const itemPrices = form.getFieldValue("itemPrices") || [];
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
            name: searchText,
            entityStatus: ENTITYSTATUS.ACTIVE
        };
        searchItemCategories({ client, filter });
    }

    onCategorySelected(categoryId, categoryOption) {
        if (!categoryOption) return;
        const { form } = this.props;
        const { setFieldsValue } = form;
        const { category } = categoryOption.props;
        setFieldsValue({
            category
        });
    }

    validateCategory(rule, categoryId, callback) {
        const { form } = this.props;
        const { getFieldValue } = form;
        const selectedCategory = getFieldValue("category");
        if (selectedCategory && selectedCategory._id === categoryId) callback();
        else callback(new Error());
    }

    onSearchBrands(searchText) {
        const { searchItemBrands, client } = this.props;
        const filter = {
            name: searchText,
            entityStatus: ENTITYSTATUS.ACTIVE
        };
        searchItemBrands({ client, filter });
    }

    onBrandSelected(brandId, brandOption) {
        if (!brandOption) return;
        const { form } = this.props;
        const { setFieldsValue } = form;
        const { brand } = brandOption.props;
        setFieldsValue({
            brand
        });
    }

    validateBrand(rule, brandId, callback) {
        const { form } = this.props;
        const { getFieldValue } = form;
        const selectedBrand = getFieldValue("brand");
        if (selectedBrand && selectedBrand._id === brandId) callback();
        else callback(new Error());
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
            width: "70%",
            maskClosable: false
        };

        const formItemProps = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };

        const leftSideFormProps = {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 10,
            xl: 10
        };

        const rightSideFormProps = {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 14,
            xl: 14
        };

        const categoryOptions = categories.map(category =>
            <Select.Option
                key={category._id}
                text={category.name}
                category={category}
            >
                <span>
                    {category.name}
                </span>
            </Select.Option>
        );

        const brandOptions = brands.map(brand =>
            <Select.Option key={brand._id} text={brand.name} brand={brand}>
                <span>
                    {brand.name}
                </span>
            </Select.Option>
        );

        return (
            <Modal {...modalProps}>
                <Form onSubmit={this.onOk}>
                    <Row>
                        <Col {...leftSideFormProps}>
                            <Form.Item>
                                {getFieldDecorator("_id")(
                                    <Input style={{ display: "none" }} />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("item-name")}
                                hasFeedback
                            >
                                {getFieldDecorator("name", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "item-name-required"
                                            )
                                        }
                                    ]
                                })(
                                    <Input
                                        placeholder={i18n.__(
                                            "item-name-placeholder"
                                        )}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("item-brand")}
                                hasFeedback
                            >
                                {getFieldDecorator("brandId", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "item-brand-required"
                                            ),
                                            validator: this.validateBrand
                                        }
                                    ]
                                })(
                                    <Select
                                        placeholder={i18n.__(
                                            "item-brand-placeholder"
                                        )}
                                        mode="combobox"
                                        notFoundContent=""
                                        optionLabelProp="text"
                                        defaultActiveFirstOption={false}
                                        filterOption={false}
                                        onSearch={this.onSearchBrands}
                                        onSelect={this.onBrandSelected}
                                    >
                                        {brandOptions}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("item-category")}
                                hasFeedback
                            >
                                {getFieldDecorator("categoryId", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "item-category-required"
                                            ),
                                            validator: this.validateCategory
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
                                        onSelect={this.onCategorySelected}
                                    >
                                        {categoryOptions}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("item-unit")}
                                hasFeedback
                            >
                                {getFieldDecorator("baseUnit", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "item-baseUnit-required"
                                            )
                                        }
                                    ]
                                })(
                                    <Input
                                        placeholder={i18n.__(
                                            "item-unit-placeholder"
                                        )}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("item-price")}
                                hasFeedback
                            >
                                {getFieldDecorator("basePrice", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "item-basePrice-required"
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
                                            value
                                                .toString()
                                                .replace(/Rp\s?|(,*)/g, "")}
                                        placeholder={i18n.__(
                                            "item-price-placeholder"
                                        )}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("item-stock")}
                                hasFeedback
                            >
                                {getFieldDecorator("stock")(
                                    <InputNumber
                                        disabled
                                        style={{ width: "100%" }}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col
                            className="item-prices-col"
                            {...rightSideFormProps}
                        >
                            <ItemFormPrices itemForm={form} />
                        </Col>
                    </Row>
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
        brand,
        categoryId,
        category,
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
                value:
                    editingItem[`itemPrice-${itemPriceId}-unit`] !== undefined
                        ? editingItem[`itemPrice-${itemPriceId}-unit`]
                        : unit
            };
            itemPriceData[`itemPrice-${itemPriceId}-multiplier`] = {
                value:
                    editingItem[`itemPrice-${itemPriceId}-multiplier`] !==
                    undefined
                        ? editingItem[`itemPrice-${itemPriceId}-multiplier`]
                        : multiplier
            };
            itemPriceData[`itemPrice-${itemPriceId}-price`] = {
                value:
                    editingItem[`itemPrice-${itemPriceId}-price`] !== undefined
                        ? editingItem[`itemPrice-${itemPriceId}-price`]
                        : price
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
        category: { value: category },
        brandId: {
            value: brandId
        },
        brand: { value: brand },
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
