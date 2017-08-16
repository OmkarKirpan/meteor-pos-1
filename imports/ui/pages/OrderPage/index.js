import { OrderForm, OrderHeader, OrderList } from "../../components";
import React, { Component } from "react";
import {
    changeOrderForm,
    changeOrderItemForm,
    changeOrdersPage,
    closeOrderForm,
    closeOrderItemForm,
    editOrderForm,
    editOrderItemForm,
    newOrderForm,
    newOrderItemForm,
    searchOrderCustomers,
    searchOrderItems,
    searchOrders
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import OrderItemForm from "../";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ order }) => {
    return { order };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                changeOrdersPage,
                closeOrderForm,
                editOrderForm,
                newOrderForm,
                searchOrders,
                searchOrderCustomers,
                changeOrderForm,
                searchOrderItems,
                newOrderItemForm,
                editOrderItemForm,
                closeOrderItemForm,
                changeOrderItemForm
            },
            dispatch
        )
    };
};

@compose(withApollo)
@connect(mapStateToProps, mapDispatchToProps)
class OrderPage extends Component {
    render() {
        const { order, client } = this.props;

        const { orderList, orderForm, orderItemForm } = order;

        const {
            loading,
            error,
            orders,
            current,
            pageSize,
            total,
            filter
        } = orderList;

        const { visible, editingOrder, isNew, customers } = orderForm;

        const {
            newOrderForm,
            changeOrdersPage,
            closeOrderForm,
            searchOrders,
            editOrderForm,
            searchOrderCustomers,
            changeOrderForm,
            searchOrderItems,
            newOrderItemForm,
            editOrderItemForm,
            closeOrderItemForm,
            changeOrderItemForm
        } = this.props.actions;

        const orderHeaderProps = {
            newOrderForm,
            searchOrders,
            filter
        };

        const orderListProps = {
            loading,
            error,
            orders,
            current,
            pageSize,
            total,
            changeOrdersPage,
            editOrderForm,
            filter
        };

        const orderFormProps = {
            customers,
            visible,
            isNew,
            closeOrderForm,
            editingOrder,
            searchOrderCustomers,
            searchOrderItems,
            changeOrderForm,
            newOrderItemForm,
            editOrderItemForm,
            closeOrderItemForm,
            orderItemForm,
            changeOrderItemForm
        };

        return (
            <div>
                <OrderHeader {...orderHeaderProps} />
                <OrderList {...orderListProps} />
                <OrderForm {...orderFormProps} />
            </div>
        );
    }
}

OrderPage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient).isRequired
};

export default OrderPage;
