import "./index.scss";

import React, { Component } from "react";
import {
    SupplyOrderForm,
    SupplyOrderHeader,
    SupplyOrderList
} from "../../components";
import {
    changeSupplyOrderForm,
    closeSupplyOrderForm,
    editsupplyOrderForm,
    newSupplyOrderForm,
    searchSupplyOrderItems,
    searchSupplyOrderSuppliers,
    searchSupplyOrders
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import PropTypes from "prop-types";
import { Row } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ supplyOrder }) => {
    return { supplyOrder };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                changeSupplyOrderForm,
                closeSupplyOrderForm,
                newSupplyOrderForm,
                searchSupplyOrders,
                searchSupplyOrderItems,
                searchSupplyOrderSuppliers
            },
            dispatch
        )
    };
};

@compose(withApollo)
@connect(mapStateToProps, mapDispatchToProps)
class SupplyOrderPage extends Component {
    render() {
        const { supplyOrder, client } = this.props;

        const { supplyOrderList, supplyOrderForm } = supplyOrder;

        const {
            loading,
            error,
            supplyOrders,
            current,
            pageSize,
            total,
            filter
        } = supplyOrderList;

        const {
            visible,
            editingSupplyOrder,
            isNew,
            items,
            suppliers
        } = supplyOrderForm;

        const {
            newSupplyOrderForm,
            changeSupplyOrderForm,
            closeSupplyOrderForm,
            searchSupplyOrders,
            searchSupplyOrderItems,
            searchSupplyOrderSuppliers
        } = this.props.actions;

        const supplyOrderHeaderProps = {
            newSupplyOrderForm,
            searchSupplyOrders,
            filter
        };

        const supplyOrderListProps = {
            loading,
            error,
            supplyOrders,
            current,
            pageSize,
            total,
            filter
        };

        const supplyOrderFormProps = {
            suppliers,
            visible,
            isNew,
            closeSupplyOrderForm,
            editingSupplyOrder,
            searchSupplyOrderItems,
            changeSupplyOrderForm,
            searchSupplyOrderSuppliers,
            items
        };

        return (
            <Row>
                <Row className="supplyOrder-page-header">
                    <SupplyOrderHeader {...supplyOrderHeaderProps} />
                </Row>
                <Row>
                    <SupplyOrderList {...supplyOrderListProps} />
                </Row>
                <Row>
                    <SupplyOrderForm {...supplyOrderFormProps} />
                </Row>
            </Row>
        );
    }
}

SupplyOrderPage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient)
};

export default SupplyOrderPage;
