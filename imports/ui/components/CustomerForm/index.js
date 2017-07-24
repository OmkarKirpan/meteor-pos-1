import { Form, Input, Modal } from "antd";
import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class CustomerForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
    }

    onOk() {
        const { form, client, onOk } = this.props;
        form.validateFields((errors, customer) => {
            if (!errors) {
                onOk({
                    client,
                    customer
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
                    <Form.Item label={i18n.__("customer-name")} hasFeedback>
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "customer-required-field-name"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "customer-name-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={i18n.__("customer-address")} hasFeedback>
                        {getFieldDecorator("address", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "customer-required-field-address"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "customer-address-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        label={i18n.__("customer-phone-number")}
                        hasFeedback
                    >
                        {getFieldDecorator("phoneNumber", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "customer-required-field-phone-number"
                                    )
                                },
                                {
                                    required: false,
                                    pattern: /[0-9]/,
                                    message: i18n.__(
                                        "customer-isnumeric-field-phone-number"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "customer-phone-number-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

CustomerForm.propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.any.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

const mapPropsToFields = ({ editingCustomer }) => {
    const { _id, name, address, phoneNumber, status } = editingCustomer;
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

export default Form.create({ mapPropsToFields })(CustomerForm);
