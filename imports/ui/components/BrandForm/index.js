import { CREATEBRAND, UPDATEBRAND } from "../../graphql/mutations/brand";
import { Form, Input, Modal } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import i18n from "meteor/universe:i18n";

@graphql(CREATEBRAND, {
    name: "createBrand"
})
@graphql(UPDATEBRAND, {
    name: "updateBrand"
})
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
                })
                    .then(() => closeBrandForm())
                    .catch(err => {
                        console.error(err);
                        Modal.error({ title: i18n.__("brand-save-failed") });
                    });
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
            width: "30%",
            maskClosable: false
        };

        const formItemProps = {
            labelCol: { span: 6 },
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
                        label={i18n.__("brand-name")}
                        hasFeedback
                    >
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__("brand-name-required")
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
    form: PropTypes.object,
    closeBrandForm: PropTypes.func,
    isNew: PropTypes.bool,
    visible: PropTypes.bool
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
