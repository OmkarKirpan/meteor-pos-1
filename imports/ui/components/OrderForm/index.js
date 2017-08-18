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
        this.validateCustomer = this.validateCustomer.bind(this);
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

    validateCustomer(rule, customerId, callback) {
        const { form } = this.props;
        const { getFieldValue } = form;
        const selectedCustomer = getFieldValue("customer");
        if (selectedCustomer && selectedCustomer._id === customerId) callback();
        else callback(new Error());
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
                <Row type="flex" justify="end">
                    <Col>
                        <Button
                            className="order-save-button"
                            key="cancel"
                            onClick={closeOrderForm}
                        >
                            {i18n.__("cancel")}
                        </Button>
                    </Col>
                    <Col>
                        {(orderStatus === ORDERSTATUS.INPROGRESS ||
                            orderStatus === ORDERSTATUS.FINALIZED) &&
                            <Button
                                className="order-save-button"
                                key="cancelOrder"
                                onClick={() => this.cancelOrder()}
                            >
                                {i18n.__("order-cancel")}
                            </Button>}
                    </Col>
                    <Col>
                        {(orderStatus === ORDERSTATUS.INPROGRESS ||
                            !orderStatus) &&
                            <Button
                                className="order-save-button"
                                key="saveOrder"
                                onClick={() => this.saveOrder()}
                            >
                                {i18n.__("order-save")}
                            </Button>}
                    </Col>
                    <Col>
                        {(orderStatus === ORDERSTATUS.INPROGRESS ||
                            !orderStatus) &&
                            <Button
                                className="order-save-button"
                                key="finalizeOrder"
                                onClick={
                                    isNew
                                        ? () =>
                                              this.saveOrder(this.finalizeOrder)
                                        : () => this.finalizeOrder()
                                }
                            >
                                {isNew
                                    ? i18n.__("order-save-finalize")
                                    : i18n.__("order-finalize")}
                            </Button>}
                    </Col>
                    <Col>
                        {(orderStatus === ORDERSTATUS.INPROGRESS ||
                            orderStatus === ORDERSTATUS.FINALIZED ||
                            !orderStatus) &&
                            <Button
                                className="order-save-button"
                                key="completeOrder"
                                onClick={
                                    isNew
                                        ? () =>
                                              this.saveOrder(this.completeOrder)
                                        : () => this.completeOrder()
                                }
                            >
                                {isNew
                                    ? i18n.__("order-save-complete")
                                    : i18n.__("order-save")}
                            </Button>}
                    </Col>
                    <Col>
                        {orderStatus === ORDERSTATUS.COMPLETED &&
                            <Button
                                className="order-save-button"
                                key="printOrder"
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
                                {...formItemProps}
                                label={i18n.__("order-customer")}
                                hasFeedback
                            >
                                {getFieldDecorator("customerId", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "order-customer-required"
                                            ),
                                            validator: this.validateCustomer
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
                                {...formItemProps}
                                label={i18n.__("order-shipmentInfo-address")}
                                hasFeedback
                            >
                                {getFieldDecorator("shipmentInfo-address", {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "order-shipmentInfo-address-required"
                                            )
                                        }
                                    ]
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
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "order-shipmentInfo-phoneNumber-required"
                                            )
                                        }
                                    ]
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
                                        rules: [
                                            {
                                                required: true,
                                                message: i18n.__(
                                                    "order-shipmentInfo-cellphoneNumber-required"
                                                )
                                            }
                                        ]
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
