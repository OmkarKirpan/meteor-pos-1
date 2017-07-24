import { Button, Form, Icon, Input, InputNumber, Modal, Table } from "antd";
import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class InvoiceForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
        this.removePrice = this.removePrice.bind(this);
        this.addPrice = this.addPrice.bind(this);
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
        const { form, client, onOk } = this.props;
        const { getFieldValue } = form;
        form.validateFields((errors, invoice) => {
            if (!errors) {
                const pricesData = getFieldValue("prices");
                const priceIds = pricesData.map(price => price._id);
                const prices = priceIds.map(priceId => {
                    return {
                        _id: priceId.indexOf("NEW") > -1 ? undefined : priceId,
                        unit: invoice[`unit-${priceId}`],
                        price: invoice[`price-${priceId}`],
                        multiplier: invoice[`multiplier-${priceId}`]
                    };
                });
                onOk({
                    client,
                    invoice: {
                        ...invoice,
                        prices
                    }
                });
            }
        });
    }

    render() {
        const {
            form,
            visible,
            title,
            onCancel,
            okText,
            cancelText
        } = this.props;
        const { getFieldDecorator, getFieldValue } = form;

        const modalProps = {
            title,
            visible,
            onCancel,
            okText,
            cancelText,
            onOk: this.onOk,
            width: 400,
            maskClosable: false
        };

        const prices = getFieldValue("prices");

        const pricesDatasource = prices.map(invoicePrice => {
            let { _id } = invoicePrice;
            return {
                _id: (
                    <Form.Invoice className="invoice-form-invoice">
                        {getFieldDecorator(`_id-${_id}`)(
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.removePrice(_id)}
                            />
                        )}
                    </Form.Invoice>
                ),
                unit: (
                    <Form.Invoice className="invoice-form-invoice">
                        {getFieldDecorator(`unit-${_id}`, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "invoice-required-field-unit"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "invoice-unit-placeholder"
                                )}
                            />
                        )}
                    </Form.Invoice>
                ),
                price: (
                    <Form.Invoice className="invoice-form-invoice">
                        {getFieldDecorator(`price-${_id}`, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "invoice-required-field-price"
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
                                    "invoice-price-placeholder"
                                )}
                            />
                        )}
                    </Form.Invoice>
                ),
                multiplier: (
                    <Form.Invoice className="invoice-form-invoice">
                        {getFieldDecorator(`multiplier-${_id}`, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "invoice-required-field-multiplier"
                                    )
                                }
                            ]
                        })(
                            <InputNumber
                                style={{ width: "100%" }}
                                placeholder={i18n.__(
                                    "invoice-multiplier-placeholder"
                                )}
                            />
                        )}
                    </Form.Invoice>
                )
            };
        });

        const invoicePricesTableProps = {
            pagination: false,
            dataSource: pricesDatasource,
            columns: [
                {
                    title: i18n.__("invoice-unit"),
                    dataIndex: "unit",
                    key: "unit",
                    width: "30%"
                },
                {
                    title: i18n.__("invoice-price"),
                    dataIndex: "price",
                    key: "price",
                    width: "30%"
                },
                {
                    title: i18n.__("invoice-multiplier"),
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

        return (
            <Modal {...modalProps}>
                <Form onSubmit={this.onOk}>
                    <Form.Item className="invoice-form-invoice">
                        {getFieldDecorator("_id")(
                            <Input style={{ display: "none" }} />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="invoice-form-invoice"
                        label={i18n.__("invoice-name")}
                        hasFeedback
                    >
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "invoice-required-field-name"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "invoice-name-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="invoice-form-invoice"
                        label={i18n.__("invoice-unit")}
                        hasFeedback
                    >
                        {getFieldDecorator("baseUnit", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "invoice-required-field-unit"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "invoice-unit-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="invoice-form-invoice"
                        label={i18n.__("invoice-price")}
                        hasFeedback
                    >
                        {getFieldDecorator("basePrice", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "invoice-required-field-price"
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
                                    "invoice-price-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="invoice-form-invoice"
                        label={i18n.__("invoice-stock")}
                        hasFeedback
                    >
                        {getFieldDecorator("stock")(
                            <InputNumber
                                disabled
                                style={{ width: "100%" }}
                                placeholder={i18n.__(
                                    "invoice-stock-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Table
                            className="invoice-form-price-table"
                            {...invoicePricesTableProps}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={this.addPrice}
                            style={{ width: "60%" }}
                        >
                            <Icon type="plus" /> Add field
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

InvoiceForm.propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.any.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

const mapPropsToFields = ({ editingInvoice }) => {
    const { _id, name, basePrice, baseUnit, stock, prices } = editingInvoice;

    let pricesData = {};
    if (prices) {
        prices.forEach(invoicePrice => {
            const { _id, unit, price, multiplier } = invoicePrice;
            pricesData[`_id-${_id}`] = { value: _id };
            pricesData[`unit-${_id}`] = { value: unit };
            pricesData[`price-${_id}`] = { value: price };
            pricesData[`multiplier-${_id}`] = { value: multiplier };
        });
    }

    return {
        _id: {
            value: _id
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
            value: prices || []
        },
        newPriceCount: {
            value: 0
        },
        ...pricesData
    };
};

export default Form.create({ mapPropsToFields })(InvoiceForm);
