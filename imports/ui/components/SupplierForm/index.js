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
    CREATESUPPLIER,
    UPDATESUPPLIER
} from "../../graphql/mutations/supplier";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@graphql(CREATESUPPLIER, {
    name: "createSupplier"
})
@graphql(UPDATESUPPLIER, {
    name: "updateSupplier"
})
@compose(withApollo)
class SupplierForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
    }

    onOk() {
        const {
            form,
            createSupplier,
            updateSupplier,
            isNew,
            closeSupplierForm
        } = this.props;
        const { getFieldValue } = form;

        form.validateFields((errors, supplier) => {
            if (!errors) {
                const mutation = isNew
                    ? props => {
                          return createSupplier(props);
                      }
                    : props => {
                          return updateSupplier(props);
                      };
                mutation({
                    variables: {
                        supplier: {
                            ...supplier
                        }
                    }
                }).then(() => closeSupplierForm());
            }
        });
    }

    render() {
        const { form, visible, closeSupplierForm, isNew } = this.props;
        const { getFieldDecorator, getFieldValue } = form;

        const modalProps = {
            title: i18n.__(isNew ? "supplier-add" : "supplier-update"),
            visible,
            onCancel: closeSupplierForm,
            okText: i18n.__(isNew ? "create" : "update"),
            cancelText: i18n.__("cancel"),
            onOk: this.onOk,
            width: 400,
            maskClosable: false
        };

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
                        label={i18n.__("supplier-name")}
                        hasFeedback
                    >
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
                    <Form.Item
                        className="item-form-item"
                        label={i18n.__("supplier-address")}
                        hasFeedback
                    >
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
                        className="item-form-item"
                        label={i18n.__("supplier-phoneNumber")}
                        hasFeedback
                    >
                        {getFieldDecorator("phoneNumber", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "supplier-required-field-phoneNumber"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "supplier-phoneNumber-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="item-form-item"
                        label={i18n.__("supplier-cellphoneNumber")}
                        hasFeedback
                    >
                        {getFieldDecorator("cellphoneNumber", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "supplier-required-field-cellphoneNumber"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "supplier-cellphoneNumber-placeholder"
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
    visible: PropTypes.bool.isRequired
};

const mapPropsToFields = ({ editingSupplier }) => {
    const {
        _id,
        name,
        address,
        phoneNumber,
        cellphoneNumber
    } = editingSupplier;

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

const onValuesChange = (props, supplier) => {
    const { changeSupplierForm } = props;
    changeSupplierForm({ supplier });
};

export default Form.create({ mapPropsToFields, onValuesChange })(SupplierForm);
