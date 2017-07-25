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
import {
    CREATEINVENTORY,
    UPDATEINVENTORY
} from "../../graphql/mutations/inventory";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@graphql(CREATEINVENTORY, {
    name: "createInventory"
})
@graphql(UPDATEINVENTORY, {
    name: "updateInventory"
})
@compose(withApollo)
class InventoryForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
        this.removePrice = this.removePrice.bind(this);
        this.addPrice = this.addPrice.bind(this);
        this.onSearchCategories = this.onSearchCategories.bind(this);
    }

    addPrice() {
        const { form } = this.props;
        const { getFieldValue, setFieldsValue } = form;
        const newPriceCount = getFieldValue("newPriceCount") + 1;
        const pricesData = getFieldValue("prices");
        setFieldsValue({
            newPriceCount,
            prices: pricesData.concat({ _id: `NEW${newPriceCount}` })
        });
    }

    removePrice(_id) {
        const { form } = this.props;
        const { getFieldValue, setFieldsValue } = form;
        const pricesData = getFieldValue("prices");
        setFieldsValue({
            prices: pricesData.filter(price => price._id !== _id)
        });
    }

    onOk() {
        let {
            form,
            client,
            createInventory,
            updateInventory,
            isNew,
            closeInventoryForm
        } = this.props;
        let { getFieldValue } = form;
        form.validateFields((errors, inventory) => {
            if (!errors) {
                let pricesData = getFieldValue("prices");
                let priceIds = pricesData.map(price => price._id);
                let prices = priceIds.map(priceId => {
                    return {
                        _id: priceId.indexOf("NEW") > -1 ? undefined : priceId,
                        unit: inventory[`unit-${priceId}`],
                        price: inventory[`price-${priceId}`],
                        multiplier: inventory[`multiplier-${priceId}`]
                    };
                });

                let inventoryData = {
                    _id: inventory._id,
                    categoryId: inventory.categoryId,
                    name: inventory.name,
                    basePrice: inventory.basePrice,
                    baseUnit: inventory.baseUnit,
                    prices
                };

                let mutation = isNew
                    ? props => {
                          return createInventory(props);
                      }
                    : props => {
                          return updateInventory(props);
                      };
                mutation({
                    variables: {
                        inventory: inventoryData
                    }
                }).then(() => closeInventoryForm());
            }
        });
    }

    onSearchCategories(searchText) {
        const { searchInventoryCategories, client } = this.props;
        const filter = {
            name: searchText
        };
        searchInventoryCategories({ client, filter });
    }

    render() {
        const {
            form,
            visible,
            categories,
            closeInventoryForm,
            isNew
        } = this.props;
        const { getFieldDecorator, getFieldValue } = form;

        const modalProps = {
            title: i18n.__(isNew ? "inventory-add" : "inventory-update"),
            visible,
            onCancel: closeInventoryForm,
            okText: i18n.__(isNew ? "create" : "update"),
            cancelText: i18n.__("cancel"),
            onOk: this.onOk,
            width: 400,
            maskClosable: false
        };

        const prices = getFieldValue("prices");

        const pricesDatasource = prices.map(inventoryPrice => {
            let { _id } = inventoryPrice;
            return {
                _id: (
                    <Form.Item className="inventory-form-inventory">
                        {getFieldDecorator(`_id-${_id}`)(
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.removePrice(_id)}
                            />
                        )}
                    </Form.Item>
                ),
                unit: (
                    <Form.Item className="inventory-form-inventory">
                        {getFieldDecorator(`unit-${_id}`, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "inventory-required-field-unit"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "inventory-unit-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                ),
                price: (
                    <Form.Item className="inventory-form-inventory">
                        {getFieldDecorator(`price-${_id}`, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "inventory-required-field-price"
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
                                placeholder={i18n.__(
                                    "inventory-price-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                ),
                multiplier: (
                    <Form.Item className="inventory-form-inventory">
                        {getFieldDecorator(`multiplier-${_id}`, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "inventory-required-field-multiplier"
                                    )
                                }
                            ]
                        })(
                            <InputNumber
                                style={{ width: "100%" }}
                                placeholder={i18n.__(
                                    "inventory-multiplier-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                )
            };
        });

        const inventoryPricesTableProps = {
            pagination: false,
            dataSource: pricesDatasource,
            columns: [
                {
                    title: i18n.__("inventory-unit"),
                    dataIndex: "unit",
                    key: "unit",
                    width: "30%"
                },
                {
                    title: i18n.__("inventory-price"),
                    dataIndex: "price",
                    key: "price",
                    width: "30%"
                },
                {
                    title: i18n.__("inventory-multiplier"),
                    dataIndex: "multiplier",
                    key: "multiplier",
                    width: "30%"
                },
                {
                    dataIndex: "_id",
                    key: "_id",
                    width: "10%"
                }
            ],
            scroll: { y: 100 }
        };

        getFieldDecorator("prices");
        getFieldDecorator("newPriceCount");
        const categoryOptions = categories.map(category =>
            <Select.Option key={category._id} text={category.name}>
                <span>
                    {category.name}
                </span>
            </Select.Option>
        );

        return (
            <Modal {...modalProps}>
                <Form onSubmit={this.onOk}>
                    <Form.Item className="inventory-form-inventory">
                        {getFieldDecorator("_id")(
                            <Input style={{ display: "none" }} />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="inventory-form-inventory"
                        label={i18n.__("inventory-name")}
                        hasFeedback
                    >
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "inventory-required-field-name"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "inventory-name-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="inventory-form-inventory"
                        label={i18n.__("inventory-category")}
                        hasFeedback
                    >
                        {getFieldDecorator("categoryId", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "inventory-required-field-category"
                                    )
                                }
                            ]
                        })(
                            <Select
                                placeholder={i18n.__(
                                    "inventory-category-placeholder"
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
                        className="inventory-form-inventory"
                        label={i18n.__("inventory-unit")}
                        hasFeedback
                    >
                        {getFieldDecorator("baseUnit", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "inventory-required-field-unit"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "inventory-unit-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="inventory-form-inventory"
                        label={i18n.__("inventory-price")}
                        hasFeedback
                    >
                        {getFieldDecorator("basePrice", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "inventory-required-field-price"
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
                                placeholder={i18n.__(
                                    "inventory-price-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="inventory-form-inventory"
                        label={i18n.__("inventory-stock")}
                        hasFeedback
                    >
                        {getFieldDecorator("stock")(
                            <InputNumber
                                disabled
                                style={{ width: "100%" }}
                                placeholder={i18n.__(
                                    "inventory-stock-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Table
                            className="inventory-form-price-table"
                            {...inventoryPricesTableProps}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={this.addPrice}
                            style={{ width: "60%" }}
                        >
                            <Icon type="plus" />
                            {i18n.__("inventory-add-item-price")}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

InventoryForm.propTypes = {
    visible: PropTypes.bool.isRequired
};

const mapPropsToFields = ({ editingInventory }) => {
    let {
        _id,
        categoryId,
        name,
        basePrice,
        baseUnit,
        stock,
        prices,
        newPriceCount
    } = editingInventory;

    let priceCount = newPriceCount || 0;

    let pricesData = [];
    let pricesLayoutData = {};
    if (prices) {
        prices.forEach(inventoryPrice => {
            priceCount += 1;

            let { unit, price, multiplier } = inventoryPrice;
            let _id = `NEW${priceCount}`;

            pricesData.push({ _id, unit, price, multiplier });
            pricesLayoutData[`_id-${_id}`] = { value: _id };
            pricesLayoutData[`unit-${_id}`] = {
                value: editingInventory[`unit-${_id}`] || unit
            };
            pricesLayoutData[`price-${_id}`] = {
                value: editingInventory[`price-${_id}`] || price
            };
            pricesLayoutData[`multiplier-${_id}`] = {
                value: editingInventory[`multiplier-${_id}`] || multiplier
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
        prices: {
            value: pricesData || []
        },
        newPriceCount: {
            value: priceCount
        },
        ...pricesLayoutData
    };
};

const onValuesChange = (props, inventory) => {
    const { changeInventoryForm } = props;
    changeInventoryForm({ inventory });
};

export default Form.create({ mapPropsToFields, onValuesChange })(InventoryForm);
