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
import { CREATEBRAND, UPDATEBRAND } from "../../graphql/mutations/brand";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@graphql(CREATEBRAND, {
    name: "createBrand"
})
@graphql(UPDATEBRAND, {
    name: "updateBrand"
})
@compose(withApollo)
class BrandForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
    }

    onOk() {
        const {
            form,
            createBrand,
            updateBrand,
            isNew,
            closeBrandForm
        } = this.props;
        const { getFieldValue } = form;

        form.validateFields((errors, brand) => {
            if (!errors) {
                const mutation = isNew
                    ? props => {
                          return createBrand(props);
                      }
                    : props => {
                          return updateBrand(props);
                      };
                mutation({
                    variables: {
                        brand: {
                            ...brand
                        }
                    }
                }).then(() => closeBrandForm());
            }
        });
    }

    render() {
        const { form, visible, closeBrandForm, isNew } = this.props;
        const { getFieldDecorator, getFieldValue } = form;

        const modalProps = {
            title: i18n.__(isNew ? "brand-add" : "brand-update"),
            visible,
            onCancel: closeBrandForm,
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
                        label={i18n.__("brand-name")}
                        hasFeedback
                    >
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "brand-required-field-name"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__("brand-name-placeholder")}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

BrandForm.propTypes = {
    visible: PropTypes.bool.isRequired
};

const mapPropsToFields = ({ editingBrand }) => {
    const { _id, name } = editingBrand;

    return {
        _id: {
            value: _id
        },
        name: {
            value: name
        }
    };
};

const onValuesChange = (props, brand) => {
    const { changeBrandForm } = props;
    changeBrandForm({ brand });
};

export default Form.create({ mapPropsToFields, onValuesChange })(BrandForm);
