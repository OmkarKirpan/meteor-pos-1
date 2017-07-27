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
    CREATECUSTOMER,
    UPDATECUSTOMER
} from "../../graphql/mutations/customer";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@graphql(CREATECUSTOMER, {
    name: "createCustomer"
})
@graphql(UPDATECUSTOMER, {
    name: "updateCustomer"
})
@compose(withApollo)
class CustomerForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
    }

    onOk() {
        const {
            form,
            createCustomer,
            updateCustomer,
            isNew,
            closeCustomerForm
        } = this.props;
        const { getFieldValue } = form;

        form.validateFields((errors, customer) => {
            if (!errors) {
                let mutation = isNew
                    ? props => {
                          return createCustomer(props);
                      }
                    : props => {
                          return updateCustomer(props);
                      };
                mutation({
                    variables: {
                        customer: {
                            ...customer
                        }
                    }
                }).then(() => closeCustomerForm());
            }
        });
    }

    render() {
        const { form, visible, closeCustomerForm, isNew } = this.props;
        const { getFieldDecorator, getFieldValue } = form;

        const modalProps = {
            title: i18n.__(isNew ? "customer-add" : "customer-update"),
            visible,
            onCancel: closeCustomerForm,
            okText: i18n.__(isNew ? "create" : "update"),
            cancelText: i18n.__("cancel"),
            onOk: this.onOk,
            width: 400,
            maskClosable: false
        };

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
                        label={i18n.__("customer-name")}
                        hasFeedback
                    >
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
                    <Form.Item
                        className="inventory-form-inventory"
                        label={i18n.__("customer-address")}
                        hasFeedback
                    >
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
                        className="inventory-form-inventory"
                        label={i18n.__("customer-phoneNumber")}
                        hasFeedback
                    >
                        {getFieldDecorator("phoneNumber", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "customer-required-field-phoneNumber"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "customer-phoneNumber-placeholder"
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
    visible: PropTypes.bool.isRequired
};

const mapPropsToFields = ({ editingCustomer }) => {
    const { _id, name, address, phoneNumber } = editingCustomer;

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
        }
    };
};

const onValuesChange = (props, customer) => {
    const { changeCustomerForm } = props;
    changeCustomerForm({ customer });
};

export default Form.create({ mapPropsToFields, onValuesChange })(CustomerForm);
