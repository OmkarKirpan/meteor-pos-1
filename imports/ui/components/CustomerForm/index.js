import {
    CREATECUSTOMER,
    UPDATECUSTOMER
} from "../../graphql/mutations/customer";
import { Form, Input, Modal } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import i18n from "meteor/universe:i18n";

@graphql(CREATECUSTOMER, {
    name: "createCustomer"
})
@graphql(UPDATECUSTOMER, {
    name: "updateCustomer"
})
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
                const mutation = isNew
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
                })
                    .then(() => closeCustomerForm())
                    .catch(err => {
                        console.error(err);
                        Modal.error({ title: i18n.__("customer-save-failed") });
                    });
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
            width: "30%",
            maskClosable: false
        };

        const formItemProps = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 }
        };

        return (
            <Modal {...modalProps}>
                <Form onSubmit={this.onOk}>
                    <Form.Item>
                        {getFieldDecorator("_id")(
                            <Input style={{ display: "none" }} />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemProps}
                        label={i18n.__("customer-name")}
                        hasFeedback
                    >
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__("customer-name-required")
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
                        {...formItemProps}
                        label={i18n.__("customer-address")}
                        hasFeedback
                    >
                        {getFieldDecorator("address", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "customer-address-required"
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
                        {...formItemProps}
                        label={i18n.__("customer-phoneNumber")}
                        hasFeedback
                    >
                        {getFieldDecorator("phoneNumber", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "customer-phoneNumber-required"
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
                    <Form.Item
                        {...formItemProps}
                        label={i18n.__("customer-cellphoneNumber")}
                        hasFeedback
                    >
                        {getFieldDecorator("cellphoneNumber", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "customer-cellphoneNumber-required"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "customer-cellphoneNumber-placeholder"
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
    form: PropTypes.object,
    visible: PropTypes.bool,
    isNew: PropTypes.bool,
    closeCustomerForm: PropTypes.func
};

const mapPropsToFields = ({ editingCustomer }) => {
    const {
        _id,
        name,
        address,
        phoneNumber,
        cellphoneNumber
    } = editingCustomer;

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
        cellphoneNumber: { value: cellphoneNumber }
    };
};

const onValuesChange = (props, customer) => {
    const { changeCustomerForm } = props;
    changeCustomerForm({ customer });
};

export default Form.create({ mapPropsToFields, onValuesChange })(CustomerForm);
