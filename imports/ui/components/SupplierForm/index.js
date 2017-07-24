import { Form, Input, Modal } from "antd";
import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";

import PropTypes from "prop-types";

@compose(withApollo)
class SupplierForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
    }

    onOk() {
        const { form, client, onOk } = this.props;
        form.validateFields((errors, supplier) => {
            if (!errors) {
                onOk({
                    client,
                    supplier
                });
            }
        });
    }

    render() {
        const {
            form,
            title,
            visible,
            onCancel,
            okText,
            cancelText
        } = this.props;
        const { getFieldDecorator } = form;

        const modalProps = {
            title,
            visible,
            onCancel,
            okText,
            cancelText,
            onOk: this.onOk,
            width: 300,
            maskClosable: false
        };

        return (
            <Modal {...modalProps}>
                <Form onSubmit={this.onOk}>
                    <Form.Item>
                        {getFieldDecorator("_id")(
                            <Input style={{ display: "none" }} />
                        )}
                    </Form.Item>
                    <Form.Item label={i18n.__("supplier-name")} hasFeedback>
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "supplier-required-field-name"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "supplier-name-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={i18n.__("supplier-address")} hasFeedback>
                        {getFieldDecorator("address", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "supplier-required-field-address"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "supplier-address-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        label={i18n.__("supplier-phone-number")}
                        hasFeedback
                    >
                        {getFieldDecorator("phoneNumber", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "supplier-required-field-phone-number"
                                    )
                                },
                                {
                                    required: false,
                                    pattern: /[0-9]/,
                                    message: i18n.__(
                                        "supplier-isnumeric-field-phone-number"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "supplier-phone-number-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

SupplierForm.propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.any.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

const mapPropsToFields = ({ editingSupplier }) => {
    const { _id, name, address, phoneNumber, status } = editingSupplier;
    return {
        _id: {
            value: _id
        },
        name: {
            value: name
        },
        address: {
            value: address
        },
        phoneNumber: {
            value: phoneNumber
        },
        status: {
            value: status
        }
    };
};

export default Form.create({ mapPropsToFields })(SupplierForm);
