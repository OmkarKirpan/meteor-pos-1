import { Button, Form, Input, Modal, Row } from "antd";
import React, { Component } from "react";

import { CHANGEPASSWORD } from "../../graphql/mutations/user";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import i18n from "meteor/universe:i18n";

@graphql(CHANGEPASSWORD, {
    name: "changePassword"
})
class ChangePasswordForm extends Component {
    constructor() {
        super();
        this.changePassword = this.changePassword.bind(this);
    }

    changePassword() {
        const { form, changePassword, logout } = this.props;
        const { validateFields } = form;
        validateFields((err, { newPassword }) => {
            if (!err) {
                changePassword({
                    variables: {
                        newPassword
                    }
                })
                    .then(() => logout())
                    .catch(err => console.error(err));
            }
        });
    }

    render() {
        const { form, closeChangePasswordForm, visible } = this.props;
        const { getFieldDecorator } = form;

        const modalProps = {
            title: i18n.__("change-password-title"),
            visible,
            onCancel: closeChangePasswordForm,
            okText: i18n.__("change-password"),
            cancelText: i18n.__("cancel"),
            onOk: this.changePassword,
            width: 300,
            maskClosable: false
        };

        return (
            <Modal {...modalProps}>
                <Form>
                    <Form.Item>
                        {getFieldDecorator("newPassword", {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: i18n.__("change-password-required")
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "change-password-placeholder"
                                )}
                                size="large"
                                type="password"
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

ChangePasswordForm.propTypes = {
    form: PropTypes.object,
    closeChangePasswordForm: PropTypes.func,
    changePassword: PropTypes.func,
    logout: PropTypes.func,
    visible: PropTypes.bool
};

export default Form.create()(ChangePasswordForm);
