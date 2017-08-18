import "./index.scss";

import { Button, Form, Input, Row } from "antd";
import React, { Component } from "react";

import { CREATEUSER } from "../../graphql/mutations/user";
import { graphql } from "react-apollo";

@graphql(CREATEUSER, {
    name: "createUser"
})
class RegistrationForm extends Component {
    constructor() {
        super();
        this.register = this.register.bind(this);
    }

    register() {
        const { form, createUser } = this.props;
        const { validateFields } = form;
        validateFields((err, registrationData) => {
            if (!err) {
                const { username, password } = registrationData;
                createUser({ variables: { user: { username, password } } });
            }
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className="form">
                <div className="logo">
                    <img alt={"logo"} src="/logo.png" />
                    <span>
                        {i18n.__("login-title")}
                    </span>
                </div>
                <Form>
                    <Form.Item>
                        {getFieldDecorator("username", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__("login-username-required")
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "login-username-placeholder"
                                )}
                                size="large"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator("password", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__("login-password-required")
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "login-password-placeholder"
                                )}
                                size="large"
                                type="password"
                            />
                        )}
                    </Form.Item>
                    <Row>
                        <Button
                            type="primary"
                            size="large"
                            onClick={this.register}
                        >
                            {i18n.__("registration-signUp")}
                        </Button>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default Form.create()(RegistrationForm);
