import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Icon,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Table
} from "antd";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import { CREATESUPPLYORDER } from "../../graphql/mutations/supplyOrder";
import { ENTITYSTATUS } from "../../../constants";
import { LOCALE } from "../../configs";
import PropTypes from "prop-types";
import SupplyOrderFormItems from "../SupplyOrderFormItems";
import i18n from "meteor/universe:i18n";
import moment from "moment";

@graphql(CREATESUPPLYORDER, {
    name: "createSupplyOrder"
})
@compose(withApollo)
class SupplyOrderForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
        this.onSearchSuppliers = this.onSearchSuppliers.bind(this);
        this.onSupplierSelected = this.onSupplierSelected.bind(this);
        this.validateSupplier = this.validateSupplier.bind(this);
    }

    onOk() {
        const {
            form,
            createSupplyOrder,
            isNew,
            closeSupplyOrderForm
        } = this.props;

        form.validateFields((errors, supplyOrder) => {
            if (!errors) {
                const supplyItems = form.getFieldValue("supplyItems") || [];
                const supplyItemIds = supplyItems.map(
                    supplyItem => supplyItem.supplyItemId
                );
                const supplyItemData = supplyItemIds.map(supplyItemId => {
                    return {
                        itemId:
                            supplyOrder[`supplyItem-${supplyItemId}-itemId`],
                        quantity:
                            supplyOrder[`supplyItem-${supplyItemId}-quantity`],
                        price: supplyOrder[`supplyItem-${supplyItemId}-price`]
                    };
                });

                const supplyOrderData = {
                    _id: supplyOrder._id,
                    supplierId: supplyOrder.supplierId,
                    orderDate: supplyOrder.orderDate,
                    discount: supplyOrder.discount,
                    supplyItems: supplyItemData
                };

                createSupplyOrder({
                    variables: {
                        supplyOrder: supplyOrderData
                    }
                }).then(() => closeSupplyOrderForm());
            }
        });
    }

    onSearchSuppliers(searchText) {
        const { searchSupplyOrderSuppliers, client } = this.props;
        const filter = {
            name: searchText,
            entityStatus: ENTITYSTATUS.ACTIVE
        };
        searchSupplyOrderSuppliers({ client, filter });
    }

    onSupplierSelected(supplierId, supplierOption) {
        if (!supplierOption) return;
        const { form } = this.props;
        const { supplier } = supplierOption.props;
        form.setFieldsValue({
            supplier
        });
    }

    validateSupplier(rule, supplierId, callback) {
        const { form } = this.props;
        const { getFieldValue } = form;
        const selectedSupplier = getFieldValue("supplier");
        if (selectedSupplier && selectedSupplier._id === supplierId) callback();
        else callback(new Error());
    }

    render() {
        const {
            form,
            visible,
            items,
            closeSupplyOrderForm,
            isNew,
            searchSupplyOrderItems,
            suppliers
        } = this.props;

        const { getFieldDecorator, getFieldValue } = form;

        const editDisabled = !isNew;

        const modalProps = {
            title: i18n.__(isNew ? "supplyOrder-add" : "supplyOrder-update"),
            visible,
            okText: i18n.__(isNew ? "create" : "update"),
            cancelText: i18n.__("cancel"),
            onOk: this.onOk,
            onCancel: closeSupplyOrderForm,
            width: "60%",
            maskClosable: false
        };

        const supplyOrderFormItemsProps = {
            supplyOrderForm: form,
            editDisabled,
            searchSupplyOrderItems,
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

        const supplierOptions = suppliers.map(supplier =>
            <Select.Option
                key={supplier._id}
                text={supplier.name}
                supplier={supplier}
            >
                <span>
                    {supplier.name}
                </span>
            </Select.Option>
        );

        return (
            <Modal {...modalProps}>
                <Form onSubmit={this.saveSupplyOrder}>
                    <Row>
                        <Col {...leftSideFormProps}>
                            <Form.Item>
                                {getFieldDecorator("_id")(
                                    <Input style={{ display: "none" }} />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("supplyOrder-orderNo")}
                            >
                                {getFieldDecorator("orderNo")(
                                    <Input disabled />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("supplyOrder-orderDate")}
                            >
                                {getFieldDecorator("orderDate", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "supplyOrder-orderDate-required"
                                            )
                                        }
                                    ]
                                })(
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        placeholder={i18n.__(
                                            "supplyOrder-orderDate-placeholder"
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
                                label={i18n.__("supplyOrder-supplier")}
                                hasFeedback
                            >
                                {getFieldDecorator("supplierId", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "supplyOrder-supplier-required"
                                            ),
                                            validator: this.validateSupplier
                                        }
                                    ]
                                })(
                                    <Select
                                        disabled={!isNew}
                                        placeholder={i18n.__(
                                            "supplyOrder-supplier-placeholder"
                                        )}
                                        mode="combobox"
                                        notFoundContent=""
                                        optionLabelProp="text"
                                        defaultActiveFirstOption={false}
                                        filterOption={false}
                                        onSearch={this.onSearchSuppliers}
                                        onSelect={this.onSupplierSelected}
                                    >
                                        {supplierOptions}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("supplyOrder-discount", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "supplyOrder-discount-required"
                                            )
                                        }
                                    ]
                                })}
                            >
                                {getFieldDecorator("discount", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "supplyOrder-discount-required"
                                            )
                                        },
                                        {
                                            message: i18n.__(
                                                "supplyOrder-discount-invalid"
                                            ),
                                            validator: (_, value, callback) => {
                                                value === undefined ||
                                                value >= 0
                                                    ? callback()
                                                    : callback(new Error());
                                            }
                                        }
                                    ]
                                })(
                                    <InputNumber
                                        formatter={value =>
                                            `Rp ${value
                                                .toString()
                                                .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                )}`}
                                        parser={value =>
                                            value
                                                .toString()
                                                .replace(/Rp\s?|(,*)/g, "")}
                                        placeholder={i18n.__(
                                            "supplyOrder-discount-placeholder"
                                        )}
                                        disabled={editDisabled}
                                        style={{ width: "100%" }}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...rightSideFormProps}>
                            <SupplyOrderFormItems
                                {...supplyOrderFormItemsProps}
                            />
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

SupplyOrderForm.propTypes = {
    visible: PropTypes.bool.isRequired
};

const mapPropsToFields = ({ editingSupplyOrder }) => {
    const {
        _id,
        supplierId,
        orderNo,
        orderDate,
        discount,
        supplyItems,
        supplyItemCount,
        supplier
    } = editingSupplyOrder;

    const supplyItemData = {};
    supplyItems &&
        supplyItems.forEach(supplyItem => {
            const { supplyItemId, itemId, item, price, quantity } = supplyItem;
            supplyItemData[`supplyItem-${supplyItemId}-itemId`] = {
                value:
                    editingSupplyOrder[`supplyItem-${supplyItemId}-itemId`] !==
                    undefined
                        ? editingSupplyOrder[
                              `supplyItem-${supplyItemId}-itemId`
                          ]
                        : itemId
            };
            supplyItemData[`supplyItem-${supplyItemId}-quantity`] = {
                value:
                    editingSupplyOrder[
                        `supplyItem-${supplyItemId}-quantity`
                    ] !== undefined
                        ? editingSupplyOrder[
                              `supplyItem-${supplyItemId}-quantity`
                          ]
                        : quantity
            };
            supplyItemData[`supplyItem-${supplyItemId}-item`] = {
                value:
                    editingSupplyOrder[`supplyItem-${supplyItemId}-item`] !==
                    undefined
                        ? editingSupplyOrder[`supplyItem-${supplyItemId}-item`]
                        : item
            };
            supplyItemData[`supplyItem-${supplyItemId}-price`] = {
                value:
                    editingSupplyOrder[`supplyItem-${supplyItemId}-price`] !==
                    undefined
                        ? editingSupplyOrder[`supplyItem-${supplyItemId}-price`]
                        : price
            };
        });

    return {
        _id: {
            value: _id
        },
        supplierId: {
            value: supplierId
        },
        supplier: {
            value: supplier
        },
        orderNo: {
            value: orderNo
        },
        orderDate: {
            value: orderDate
        },
        discount: {
            value: discount
        },
        supplyItems: {
            value: supplyItems
        },
        supplyItemCount: {
            value: supplyItemCount
        },
        ...supplyItemData
    };
};

const onValuesChange = (props, supplyOrder) => {
    const { changeSupplyOrderForm } = props;
    changeSupplyOrderForm({ supplyOrder });
};

export default Form.create({ mapPropsToFields, onValuesChange })(
    SupplyOrderForm
);
