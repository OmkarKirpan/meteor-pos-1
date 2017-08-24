import "./index.scss";

import { CustomerForm, CustomerHeader, CustomerList } from "../../components";
import React, { Component } from "react";
import {
    changeCustomerForm,
    changeCustomersPage,
    closeCustomerForm,
    editCustomerForm,
    newCustomerForm,
    searchCustomers
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import PropTypes from "prop-types";
import { Row } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ customer }) => {
    return { customer };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                changeCustomersPage,
                closeCustomerForm,
                editCustomerForm,
                newCustomerForm,
                searchCustomers,
                changeCustomerForm
            },
            dispatch
        )
    };
};

@compose(withApollo)
@connect(mapStateToProps, mapDispatchToProps)
class CustomerPage extends Component {
    render() {
        const { customer, client } = this.props;
        const { customerList, customerForm } = customer;
        const {
            loading,
            error,
            customers,
            current,
            pageSize,
            total,
            filter
        } = customerList;
        const { visible, editingCustomer, isNew } = customerForm;
        const {
            newCustomerForm,
            changeCustomersPage,
            closeCustomerForm,
            searchCustomers,
            editCustomerForm,
            changeCustomerForm
        } = this.props.actions;

        const customerHeaderProps = {
            newCustomerForm,
            searchCustomers
        };

        const customerListProps = {
            loading,
            error,
            customers,
            current,
            pageSize,
            total,
            changeCustomersPage,
            editCustomerForm,
            filter
        };

        const customerFormProps = {
            visible,
            isNew,
            closeCustomerForm,
            editingCustomer,
            changeCustomerForm
        };

        return (
            <Row>
                <Row className="customer-page-header">
                    <CustomerHeader {...customerHeaderProps} />
                </Row>
                <Row>
                    <CustomerList {...customerListProps} />
                </Row>
                <Row>
                    <CustomerForm {...customerFormProps} />
                </Row>
            </Row>
        );
    }
}

CustomerPage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient)
};

export default CustomerPage;
