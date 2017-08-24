import { Col, DatePicker, Form, Input, Modal, Row } from "antd";
import React, { Component } from "react";

import { CREATEITEMADJUSTMENT } from "../../graphql/mutations/itemAdjustment";
import ItemAdjustmentFormItems from "../ItemAdjustmentFormItems";
import { LOCALE } from "../../configs";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import i18n from "meteor/universe:i18n";
import moment from "moment";

@graphql(CREATEITEMADJUSTMENT, {
    name: "createItemAdjustment"
})
class ItemAdjustmentForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
    }

    onOk() {
        const {
            form,
            createItemAdjustment,
            isNew,
            closeItemAdjustmentForm
        } = this.props;

        form.validateFields((errors, itemAdjustment) => {
            if (!errors) {
                const adjustmentItems =
                    form.getFieldValue("adjustmentItems") || [];
                const adjustmentItemIds = adjustmentItems.map(
                    adjustmentItem => adjustmentItem.adjustmentItemId
                );
                const adjustmentItemData = adjustmentItemIds.map(
                    adjustmentItemId => {
                        return {
                            itemId:
                                itemAdjustment[
                                    `adjustmentItem-${adjustmentItemId}-itemId`
                                ],
                            quantity:
                                itemAdjustment[
                                    `adjustmentItem-${adjustmentItemId}-quantity`
                                ]
                        };
                    }
                );

                const itemAdjustmentData = {
                    _id: itemAdjustment._id,
                    adjustmentDate: itemAdjustment.adjustmentDate,
                    reason: itemAdjustment.reason,
                    adjustmentItems: adjustmentItemData
                };

                createItemAdjustment({
                    variables: {
                        itemAdjustment: itemAdjustmentData
                    }
                })
                    .then(() => closeItemAdjustmentForm())
                    .catch(err => {
                        console.error(err);
                        Modal.error({
                            title: i18n.__("itemAdjustment-save-failed")
                        });
                    });
            }
        });
    }

    render() {
        const {
            form,
            visible,
            items,
            closeItemAdjustmentForm,
            isNew,
            searchItemAdjustmentItems
        } = this.props;

        const { getFieldDecorator, getFieldValue } = form;

        const editDisabled = !isNew;

        const modalProps = {
            title: i18n.__(
                isNew ? "itemAdjustment-add" : "itemAdjustment-update"
            ),
            visible,
            okText: i18n.__(isNew ? "create" : "update"),
            cancelText: i18n.__("cancel"),
            onOk: this.onOk,
            onCancel: closeItemAdjustmentForm,
            width: "60%",
            maskClosable: false
        };

        const itemAdjustmentFormItemsProps = {
            itemAdjustmentForm: form,
            editDisabled,
            searchItemAdjustmentItems,
            items
        };

        const formItemProps = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        };

        const leftSideFormProps = {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 10,
            xl: 10
        };

        const rightSideFormProps = {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 14,
            xl: 14
        };

        return (
            <Modal {...modalProps}>
                <Form onSubmit={this.saveItemAdjustment}>
                    <Row>
                        <Col {...leftSideFormProps}>
                            <Form.Item>
                                {getFieldDecorator("_id")(
                                    <Input style={{ display: "none" }} />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("itemAdjustment-adjustmentNo")}
                            >
                                {getFieldDecorator("adjustmentNo")(
                                    <Input disabled />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("itemAdjustment-adjustmentDate")}
                            >
                                {getFieldDecorator("adjustmentDate", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "itemAdjustment-adjustmentDate-required"
                                            )
                                        }
                                    ]
                                })(
                                    <DatePicker
                                        placeholder={i18n.__(
                                            "itemAdjustment-adjustmentDate-placeholder"
                                        )}
                                        disabled={editDisabled}
                                        locale={LOCALE.DATEPICKER}
                                        format="DD-MM-YYYY"
                                        disabledDate={currentDate => {
                                            return currentDate > moment();
                                        }}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("itemAdjustment-reason", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "itemAdjustment-reason-required"
                                            )
                                        }
                                    ]
                                })}
                            >
                                {getFieldDecorator("reason", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "itemAdjustment-reason-required"
                                            )
                                        }
                                    ]
                                })(
                                    <Input
                                        placeholder={i18n.__(
                                            "itemAdjustment-reason-placeholder"
                                        )}
                                        disabled={editDisabled}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...rightSideFormProps}>
                            <ItemAdjustmentFormItems
                                {...itemAdjustmentFormItemsProps}
                            />
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

ItemAdjustmentForm.propTypes = {
    form: PropTypes.object,
    isNew: PropTypes.bool,
    visible: PropTypes.bool,
    items: PropTypes.array,
    closeItemAdjustmentForm: PropTypes.func,
    searchItemAdjustmentItems: PropTypes.func
};

const mapPropsToFields = ({ editingItemAdjustment }) => {
    const {
        _id,
        adjustmentNo,
        adjustmentDate,
        reason,
        adjustmentItems,
        adjustmentItemCount
    } = editingItemAdjustment;

    const adjustmentItemData = {};
    adjustmentItems &&
        adjustmentItems.forEach(adjustmentItem => {
            const { adjustmentItemId, itemId, item, quantity } = adjustmentItem;
            adjustmentItemData[`adjustmentItem-${adjustmentItemId}-itemId`] = {
                value:
                    editingItemAdjustment[
                        `adjustmentItem-${adjustmentItemId}-itemId`
                    ] !== undefined
                        ? editingItemAdjustment[
                              `adjustmentItem-${adjustmentItemId}-itemId`
                          ]
                        : itemId
            };
            adjustmentItemData[
                `adjustmentItem-${adjustmentItemId}-quantity`
            ] = {
                value:
                    editingItemAdjustment[
                        `adjustmentItem-${adjustmentItemId}-quantity`
                    ] !== undefined
                        ? editingItemAdjustment[
                              `adjustmentItem-${adjustmentItemId}-quantity`
                          ]
                        : quantity
            };
            adjustmentItemData[`adjustmentItem-${adjustmentItemId}-item`] = {
                value:
                    editingItemAdjustment[
                        `adjustmentItem-${adjustmentItemId}-item`
                    ] !== undefined
                        ? editingItemAdjustment[
                              `adjustmentItem-${adjustmentItemId}-item`
                          ]
                        : item
            };
        });

    return {
        _id: {
            value: _id
        },
        adjustmentNo: {
            value: adjustmentNo
        },
        adjustmentDate: {
            value: adjustmentDate
        },
        reason: {
            value: reason
        },
        adjustmentItems: {
            value: adjustmentItems
        },
        adjustmentItemCount: {
            value: adjustmentItemCount
        },
        ...adjustmentItemData
    };
};

const onValuesChange = (props, itemAdjustment) => {
    const { changeItemAdjustmentForm } = props;
    changeItemAdjustmentForm({ itemAdjustment });
};

export default Form.create({ mapPropsToFields, onValuesChange })(
    ItemAdjustmentForm
);
