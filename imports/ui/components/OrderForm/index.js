import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Icon,
    Input,
    InputNumber,
    Modal,
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
                        address: form.getFieldValue("shipmentInfo-address"),
                        phoneNumber: form.getFieldValue(
                            "shipmentInfo-phoneNumber"
                        ),
                        cellphoneNumber: form.getFieldValue(
                            "shipmentInfo-cellphoneNumber"
                        )
                    },
                    orderItems: orderItemsData
                };

                if (isNew) {
                    orderData.orderDate = order.orderDate;
                    orderData.customerId = order.customerId;
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
                    .then(() => closeOrderForm());
            }
        });
    }

    cancelOrder() {
        const { cancelOrder, closeOrderForm, form, isNew } = this.props;
        const _id = form.getFieldValue("_id");
        cancelOrder({ variables: { _id } }).then(
            isNew ? () => {} : () => closeOrderForm()
        );
    }

    finalizeOrder() {
        const { finalizeOrder, closeOrderForm, form, isNew } = this.props;
        const _id = form.getFieldValue("_id");
        finalizeOrder({ variables: { _id } }).then(
            isNew ? () => {} : () => closeOrderForm()
        );
    }

    completeOrder() {
        const { completeOrder, closeOrderForm, form, isNew } = this.props;
        const _id = form.getFieldValue("_id");
        completeOrder({ variables: { _id } }).then(
            isNew ? () => {} : () => closeOrderForm()
        );
    }

    printOrder() {
        const { printOrder, closeOrderForm, form, isNew } = this.props;
        const _id = form.getFieldValue("_id");
        printOrder({ variables: { _id } }).then(
            isNew ? () => {} : () => closeOrderForm()
        );
    }

    onSearchCustomers(searchText) {
        const { searchOrderCustomers, client } = this.props;
        const filter = {
            name: searchText
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
            width: 400,
            maskClosable: false,
            footer: [
                <Button key="cancel" onClick={closeOrderForm}>
                    {"Cancel"}
                </Button>,
                <div>
                    {(orderStatus === ORDERSTATUS.INPROGRESS ||
                        orderStatus === ORDERSTATUS.FINALIZED) &&
                        <Button key="ok" onClick={() => this.cancelOrder()}>
                            {"Cancel Order"}
                        </Button>}
                </div>,
                <div>
                    {(orderStatus === ORDERSTATUS.INPROGRESS || !orderStatus) &&
                        <Button key="ok1" onClick={() => this.saveOrder()}>
                            {"Save Order"}
                        </Button>}
                </div>,
                <div>
                    {(orderStatus === ORDERSTATUS.INPROGRESS || !orderStatus) &&
                        <Button
                            key="ok2"
                            onClick={
                                isNew
                                    ? () => this.saveOrder(this.finalizeOrder)
                                    : () => this.finalizeOrder()
                            }
                        >
                            {isNew
                                ? "Save and Finalize Order"
                                : "Finalize Order"}
                        </Button>}
                </div>,
                <div>
                    {(orderStatus === ORDERSTATUS.INPROGRESS ||
                        orderStatus === ORDERSTATUS.FINALIZED ||
                        !orderStatus) &&
                        <Button
                            key="ok3"
                            onClick={
                                isNew
                                    ? () => this.saveOrder(this.completeOrder)
                                    : () => this.completeOrder()
                            }
                        >
                            {isNew
                                ? "Save and Complete Order"
                                : "Complete Order"}
                        </Button>}
                </div>,
                <div>
                    {orderStatus === ORDERSTATUS.COMPLETED &&
                        <Button
                            key="ok4"
                            onClick={
                                isNew
                                    ? () => this.saveOrder(this.printOrder)
                                    : () => this.printOrder()
                            }
                        >
                            {"Print"}
                        </Button>}
                </div>
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

        return (
            <Modal {...modalProps}>
                <Form onSubmit={this.saveOrder}>
                    <Form.Item className="order-form-order">
                        {getFieldDecorator("_id")(
                            <Input style={{ display: "none" }} />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="order-form-order"
                        label={i18n.__("order-orderNo")}
                    >
                        {getFieldDecorator("orderNo")(<Input disabled />)}
                    </Form.Item>
                    <Form.Item
                        className="order-form-order"
                        label={i18n.__("order-orderDate")}
                    >
                        {getFieldDecorator("orderDate")(
                            <DatePicker
                                disabled={!isNew}
                                locale={LOCALE.DATEPICKER}
                                format="DD-MM-YYYY"
                                allowClear={false}
                                disabledDate={currentDate => {
                                    return currentDate > moment();
                                }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        className="order-form-order"
                        label={i18n.__("order-customer")}
                        hasFeedback
                    >
                        {getFieldDecorator("customerId", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "order-required-field-customer"
                                    )
                                }
                            ]
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
                        className="order-form-order"
                        label={i18n.__("order-customer")}
                        hasFeedback
                    >
                        {getFieldDecorator("shipmentInfo-address", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "order-required-field-customer"
                                    )
                                }
                            ]
                        })(<Input disabled={editDisabled} />)}
                    </Form.Item>
                    <Form.Item
                        className="order-form-order"
                        label={i18n.__("order-customer")}
                        hasFeedback
                    >
                        {getFieldDecorator("shipmentInfo-phoneNumber", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "order-required-field-customer"
                                    )
                                }
                            ]
                        })(<Input disabled={editDisabled} />)}
                    </Form.Item>
                    <Form.Item
                        className="order-form-order"
                        label={i18n.__("order-customer")}
                        hasFeedback
                    >
                        {getFieldDecorator("shipmentInfo-cellphoneNumber", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "order-required-field-customer"
                                    )
                                }
                            ]
                        })(<Input disabled={editDisabled} />)}
                    </Form.Item>
                    <OrderFormItems {...orderFormItemsProps} />
                    <Form.Item
                        className="order-form-order"
                        label={i18n.__("order-customer")}
                        hasFeedback
                    >
                        {getFieldDecorator("makePayment", {
                            rules: []
                        })(<Checkbox />)}
                    </Form.Item>
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
