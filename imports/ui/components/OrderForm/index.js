import "./index.scss";

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
import {
    CANCELORDER,
    COMPLETEORDER,
    CREATEORDER,
    FINALIZEORDER,
    PRINTORDER,
    UPDATEORDER
} from "../../graphql/mutations/order";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import { ENTITYSTATUS } from "../../../constants";
import { LOCALE } from "../../configs";
import { ORDERSTATUS } from "../../../constants";
import OrderFormItems from "../OrderFormItems";
import OrderItemForm from "../OrderItemForm";
import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";
import moment from "moment";

@graphql(CREATEORDER, {
    name: "createOrder"
})
@graphql(UPDATEORDER, {
    name: "updateOrder"
})
@graphql(CANCELORDER, {
    name: "cancelOrder"
})
@graphql(FINALIZEORDER, {
    name: "finalizeOrder"
})
@graphql(COMPLETEORDER, {
    name: "completeOrder"
})
@graphql(PRINTORDER, {
    name: "printOrder"
})
@compose(withApollo)
class OrderForm extends Component {
    constructor() {
        super();
        this.saveOrder = this.saveOrder.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
        this.finalizeOrder = this.finalizeOrder.bind(this);
        this.completeOrder = this.completeOrder.bind(this);
        this.printOrder = this.printOrder.bind(this);
        this.onSearchCustomers = this.onSearchCustomers.bind(this);
        this.onCustomerSelected = this.onCustomerSelected.bind(this);
    }

    saveOrder(callback) {
        const {
            form,
            client,
            createOrder,
            updateOrder,
            isNew,
            closeOrderForm
        } = this.props;

        form.validateFields((errors, order) => {
            if (!errors) {
                const orderItems = form.getFieldValue("orderItems");
                const orderItemsData = orderItems.map(orderItem => {
                    const { itemPrices } = orderItem;
                    const itemPricesData = itemPrices.map(itemPrice => {
                        const {
                            unit,
                            quantity,
                            multiplier,
                            price,
                            discount
                        } = itemPrice;
                        return {
                            unit,
                            quantity,
                            multiplier,
                            price,
                            discount
                        };
                    });
                    return {
                        itemId: orderItem.itemId,
                        itemPrices: itemPricesData,
                        discount: orderItem.discount
                    };
                });

                const orderData = {
                    _id: order._id,
                    shipmentInfo: {
                        address:
                            form.getFieldValue("shipmentInfo-address") || "",
                        phoneNumber:
                            form.getFieldValue("shipmentInfo-phoneNumber") ||
                            "",
                        cellphoneNumber:
                            form.getFieldValue(
                                "shipmentInfo-cellphoneNumber"
                            ) || ""
                    },
                    orderItems: orderItemsData
                };

                if (isNew) {
                    orderData.orderDate = order.orderDate;
                    orderData.customerId = order.customerId || "";
                }

                const mutation = isNew
                    ? props => {
                          return createOrder(props);
                      }
                    : props => {
                          return updateOrder(props);
                      };

                mutation({
                    variables: {
                        order: orderData
                    }
                })
                    .then(({ data }) => {
                        if (callback) {
                            const _id = data.createOrder;
                            form.setFieldsValue({ _id });
                            callback();
                        }
                    })
                    .then(() => closeOrderForm())
                    .catch(err => {
                        console.error(err);
                        Modal.error({ title: i18n.__("order-save-error") });
                    });
            }
        });
    }

    cancelOrder() {
        const { cancelOrder, closeOrderForm, form, isNew } = this.props;
        const _id = form.getFieldValue("_id");
        cancelOrder({ variables: { _id } })
            .then(isNew ? () => {} : () => closeOrderForm())
            .catch(err => {
                console.error(err);
                Modal.error({ title: i18n.__("order-cancel-error") });
            });
    }

    finalizeOrder() {
        const { finalizeOrder, closeOrderForm, form, isNew } = this.props;
        const _id = form.getFieldValue("_id");
        finalizeOrder({ variables: { _id } })
            .then(isNew ? () => {} : () => closeOrderForm())
            .catch(err => {
                console.error(err);
                Modal.error({ title: i18n.__("order-finalize-error") });
            });
    }

    completeOrder() {
        const {
            finalizeOrder,
            completeOrder,
            closeOrderForm,
            printOrder,
            form,
            isNew
        } = this.props;
        const _id = form.getFieldValue("_id");
        if (isNew) {
            finalizeOrder({ variables: { _id } })
                .then(() =>
                    completeOrder({ variables: { _id } })
                        .then(() =>
                            printOrder({ variables: { _id } })
                                .then(() => closeOrderForm())
                                .catch(err => {
                                    console.error(err);
                                    alert(i18n.__("order-print-error"));
                                })
                        )
                        .catch(err => {
                            console.error(err);
                            Modal.error({
                                title: i18n.__("order-complete-error")
                            });
                        })
                )
                .catch(err => {
                    console.error(err);
                    Modal.error({ title: i18n.__("order-finalize-error") });
                });
        } else {
            completeOrder({ variables: { _id } })
                .then(() =>
                    printOrder({ variables: { _id } })
                        .then(() => closeOrderForm())
                        .catch(err => {
                            console.error(err);
                            Modal.error({
                                title: i18n.__("order-print-error")
                            });
                        })
                )
                .catch(err => {
                    console.error(err);
                    Modal.error({ title: i18n.__("order-complete-error") });
                });
        }
    }

    printOrder() {
        const { printOrder, closeOrderForm, form, isNew } = this.props;
        const _id = form.getFieldValue("_id");
        printOrder({ variables: { _id } })
            .then(isNew ? () => {} : () => closeOrderForm())
            .catch(err => {
                console.error(err);
                Modal.error({ title: i18n.__("order-print-error") });
            });
    }

    onSearchCustomers(searchText) {
        const { searchOrderCustomers, client } = this.props;
        const filter = {
            name: searchText,
            entityStatus: ENTITYSTATUS.ACTIVE
        };
        searchOrderCustomers({ client, filter });
    }

    onCustomerSelected(customerId, customerOption) {
        if (!customerOption) return;
        const { form } = this.props;
        const { customer } = customerOption.props;
        form.setFieldsValue({
            "shipmentInfo-address": customer.address,
            "shipmentInfo-phoneNumber": customer.phoneNumber,
            "shipmentInfo-cellphoneNumber": customer.cellphoneNumber
        });
    }

    render() {
        const {
            form,
            visible,
            customers,
            items,
            closeOrderForm,
            isNew,
            newOrderItemForm,
            editOrderItemForm,
            closeOrderItemForm,
            orderItemForm,
            searchOrderItems,
            changeOrderItemForm,
            editingOrder
        } = this.props;

        const { orderStatus, paymentStatus } = editingOrder;

        const { getFieldDecorator, getFieldValue } = form;

        getFieldDecorator("orderItems");

        const editDisabled = !(
            isNew || editingOrder.orderStatus === ORDERSTATUS.INPROGRESS
        );

        const customerOptions = customers.map(customer =>
            <Select.Option
                key={customer._id}
                text={customer.name}
                customer={customer}
            >
                <span>
                    {customer.name}
                </span>
            </Select.Option>
        );

        const modalProps = {
            title: i18n.__(isNew ? "order-add" : "order-update"),
            visible,
            onCancel: closeOrderForm,
            width: "80%",
            maskClosable: false,
            footer: [
                <Row type="flex" justify="end" key="order-form-footer">
                    <Col key="cancel">
                        <Button
                            className="order-save-button"
                            onClick={closeOrderForm}
                        >
                            {i18n.__("cancel")}
                        </Button>
                    </Col>
                    <Col key="cancelOrder">
                        {orderStatus === ORDERSTATUS.INPROGRESS &&
                            <Button
                                className="order-save-button"
                                onClick={() => this.cancelOrder()}
                            >
                                {i18n.__("order-cancel")}
                            </Button>}
                    </Col>
                    <Col key="saveOrder">
                        {(orderStatus === ORDERSTATUS.INPROGRESS || isNew) &&
                            <Button
                                className="order-save-button"
                                onClick={() => this.saveOrder()}
                            >
                                {i18n.__("order-save")}
                            </Button>}
                    </Col>
                    <Col key="finalizeOrder">
                        {(orderStatus === ORDERSTATUS.INPROGRESS || isNew) &&
                            <Button
                                className="order-save-button"
                                onClick={() =>
                                    this.saveOrder(this.finalizeOrder)}
                            >
                                {i18n.__("order-save-finalize")}
                            </Button>}
                    </Col>
                    <Col key="completeOrder">
                        {(orderStatus === ORDERSTATUS.INPROGRESS ||
                            orderStatus === ORDERSTATUS.FINALIZED ||
                            isNew) &&
                            <Button
                                className="order-save-button"
                                onClick={
                                    isNew ||
                                    orderStatus === ORDERSTATUS.INPROGRESS
                                        ? () =>
                                              this.saveOrder(this.completeOrder)
                                        : () => this.completeOrder()
                                }
                            >
                                {isNew || orderStatus === ORDERSTATUS.INPROGRESS
                                    ? i18n.__("order-save-complete")
                                    : i18n.__("order-complete")}
                            </Button>}
                    </Col>
                    <Col key="printOrder">
                        {orderStatus === ORDERSTATUS.COMPLETED &&
                            <Button
                                className="order-save-button"
                                onClick={
                                    isNew
                                        ? () => this.saveOrder(this.printOrder)
                                        : () => this.printOrder()
                                }
                            >
                                {i18n.__("order-print")}
                            </Button>}
                    </Col>
                </Row>
            ]
        };

        const orderFormItemsProps = {
            orderForm: form,
            newOrderItemForm,
            editOrderItemForm,
            closeOrderItemForm,
            editDisabled
        };

        const orderItemFormProps = {
            orderForm: form,
            visible: orderItemForm.visible,
            items: orderItemForm.items,
            closeOrderItemForm,
            isNew: orderItemForm.isNew,
            editingOrderItem: orderItemForm.editingOrderItem,
            searchOrderItems,
            changeOrderItemForm,
            editDisabled
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
                <Form onSubmit={this.saveOrder}>
                    <Row>
                        <Col {...leftSideFormProps}>
                            <Form.Item>
                                {getFieldDecorator("_id")(
                                    <Input style={{ display: "none" }} />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("order-orderNo")}
                            >
                                {getFieldDecorator("orderNo")(
                                    <Input disabled />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("order-orderDate")}
                            >
                                {getFieldDecorator("orderDate", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "order-orderDate-required"
                                            )
                                        }
                                    ]
                                })(
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        disabled={!isNew}
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
                                label={i18n.__("order-customer")}
                                hasFeedback
                            >
                                {getFieldDecorator("customerId", {
                                    rules: []
                                })(
                                    <Select
                                        disabled={!isNew}
                                        placeholder={i18n.__(
                                            "order-customer-placeholder"
                                        )}
                                        mode="combobox"
                                        notFoundContent=""
                                        optionLabelProp="text"
                                        defaultActiveFirstOption={false}
                                        filterOption={false}
                                        onSearch={this.onSearchCustomers}
                                        onSelect={this.onCustomerSelected}
                                    >
                                        {customerOptions}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__("order-shipmentInfo-address")}
                                hasFeedback
                            >
                                {getFieldDecorator("shipmentInfo-address", {
                                    rules: []
                                })(
                                    <Input
                                        placeholder={i18n.__(
                                            "order-shipmentInfo-address-placeholder"
                                        )}
                                        disabled={editDisabled}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__(
                                    "order-shipmentInfo-phoneNumber"
                                )}
                                hasFeedback
                            >
                                {getFieldDecorator("shipmentInfo-phoneNumber", {
                                    rules: []
                                })(
                                    <Input
                                        placeholder={i18n.__(
                                            "order-shipmentInfo-phoneNumber-placeholder"
                                        )}
                                        disabled={editDisabled}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemProps}
                                label={i18n.__(
                                    "order-shipmentInfo-cellphoneNumber"
                                )}
                                hasFeedback
                            >
                                {getFieldDecorator(
                                    "shipmentInfo-cellphoneNumber",
                                    {
                                        rules: []
                                    }
                                )(
                                    <Input
                                        placeholder={i18n.__(
                                            "order-shipmentInfo-cellphoneNumber-placeholder"
                                        )}
                                        disabled={editDisabled}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col
                            className="item-prices-col"
                            {...rightSideFormProps}
                        >
                            <OrderFormItems {...orderFormItemsProps} />
                            <Form.Item
                                label={i18n.__("order-customer")}
                                hasFeedback
                            >
                                {getFieldDecorator("makePayment", {
                                    rules: []
                                })(<Checkbox />)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <OrderItemForm {...orderItemFormProps} />
            </Modal>
        );
    }
}

OrderForm.propTypes = {
    visible: PropTypes.bool.isRequired
};

const mapPropsToFields = ({ editingOrder }) => {
    const {
        _id,
        orderNo,
        orderDate,
        customerId,
        customer,
        shipmentInfo,
        orderItems,
        paidAmount,
        orderStatus,
        paymentStatus
    } = editingOrder;

    const shipmentInfoData = {
        "shipmentInfo-address": {
            value:
                editingOrder["shipmentInfo-address"] ||
                (shipmentInfo || {}).address
        },
        "shipmentInfo-phoneNumber": {
            value:
                editingOrder["shipmentInfo-phoneNumber"] ||
                (shipmentInfo || {}).phoneNumber
        },
        "shipmentInfo-cellphoneNumber": {
            value:
                editingOrder["shipmentInfo-cellphoneNumber"] ||
                (shipmentInfo || {}).cellphoneNumber
        }
    };

    return {
        _id: {
            value: _id
        },
        orderNo: {
            value: orderNo
        },
        orderDate: {
            value: orderDate
        },
        customerId: {
            value: customerId
        },
        customer: { value: customer },
        paidAmount: {
            value: paidAmount
        },
        orderStatus: {
            value: orderStatus
        },
        paymentStatus: {
            value: paymentStatus
        },
        orderItems: {
            value: orderItems
        },
        ...shipmentInfoData
    };
};

const onValuesChange = (props, order) => {
    const { changeOrderForm } = props;
    changeOrderForm({ order });
};

export default Form.create({ mapPropsToFields, onValuesChange })(OrderForm);
