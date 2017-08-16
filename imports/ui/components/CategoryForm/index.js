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
    CREATECATEGORY,
    UPDATECATEGORY
} from "../../graphql/mutations/category";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@graphql(CREATECATEGORY, {
    name: "createCategory"
})
@graphql(UPDATECATEGORY, {
    name: "updateCategory"
})
@compose(withApollo)
class CategoryForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
    }

    onOk() {
        const {
            form,
            createCategory,
            updateCategory,
            isNew,
            closeCategoryForm
        } = this.props;
        const { getFieldValue } = form;

        form.validateFields((errors, category) => {
            if (!errors) {
                const mutation = isNew
                    ? props => {
                          return createCategory(props);
                      }
                    : props => {
                          return updateCategory(props);
                      };
                mutation({
                    variables: {
                        category: {
                            ...category
                        }
                    }
                }).then(() => closeCategoryForm());
            }
        });
    }

    render() {
        const { form, visible, closeCategoryForm, isNew } = this.props;
        const { getFieldDecorator, getFieldValue } = form;

        const modalProps = {
            title: i18n.__(isNew ? "category-add" : "category-update"),
            visible,
            onCancel: closeCategoryForm,
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
                        label={i18n.__("category-name")}
                        hasFeedback
                    >
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "category-required-field-name"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "category-name-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

CategoryForm.propTypes = {
    visible: PropTypes.bool.isRequired
};

const mapPropsToFields = ({ editingCategory }) => {
    const { _id, name } = editingCategory;

    return {
        _id: {
            value: _id
        },
        name: {
            value: name
        }
    };
};

const onValuesChange = (props, category) => {
    const { changeCategoryForm } = props;
    changeCategoryForm({ category });
};

export default Form.create({ mapPropsToFields, onValuesChange })(CategoryForm);
