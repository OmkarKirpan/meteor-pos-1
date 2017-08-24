import "./index.scss";

import { Button, Form, Input, Modal, Row } from "antd";
import React, { Component } from "react";

import { CREATEUSER } from "../../graphql/mutations/user";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import i18n from "meteor/universe:i18n";

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
                createUser({ variables: { user: { username, password } } })
                    .then(() =>
                        Modal.success({
                            title: i18n.__("registration-success")
                        })
                    )
                    .catch(() =>
                        Modal.error({ title: i18n.__("registration-failed") })
                    );
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
                        {i18n.__("registration-title")}
                    </span>
                </div>
                <Form>
                    <Form.Item>
                        {getFieldDecorator("username", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "registration-username-required"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "registration-username-placeholder"
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
                                    message: i18n.__(
                                        "registration-password-required"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "registration-password-placeholder"
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
                            {i18n.__("sign-up")}
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

RegistrationForm.propTypes = {
    form: PropTypes.object,
    switchButton: PropTypes.element
};

export default Form.create()(RegistrationForm);
