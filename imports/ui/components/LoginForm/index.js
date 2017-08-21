import "./index.scss";

import { Button, Form, Input, Row } from "antd";
import React, { Component } from "react";

import i18n from "meteor/universe:i18n";

class LoginForm extends Component {
    constructor() {
        super();
        this.login = this.login.bind(this);
    }

    login() {
        const { form, login } = this.props;
        const { validateFields } = form;
        validateFields((err, loginData) => {
            if (!err) {
                const { username, password } = loginData;
                login({ username, password });
            }
        });
    }

    render() {
        const { form, switchButton } = this.props;
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
                            onClick={this.login}
                        >
                            {i18n.__("sign-in")}
                        </Button>
                    </Row>
                    <Row>
                        {switchButton}
                    </Row>
                </Form>
            </div>
        );
    }
}

export default Form.create()(LoginForm);
