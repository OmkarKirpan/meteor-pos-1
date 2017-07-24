import { CustomerForm, CustomerHeader, CustomerList } from "../../components";
import React, { Component } from "react";
import {
    changeCustomersPage,
    closeCustomerForm,
    createCustomer,
    deleteCustomer,
    editCustomerForm,
    fetchCustomers,
    newCustomerForm,
    searchCustomers,
    updateCustomer
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import PropTypes from "prop-types";
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
                createCustomer,
                deleteCustomer,
                editCustomerForm,
                fetchCustomers,
                newCustomerForm,
                searchCustomers,
                updateCustomer
            },
            dispatch
        )
    };
};

@compose(withApollo)
@connect(mapStateToProps, mapDispatchToProps)
class CustomerPage extends Component {
    componentWillMount() {
        const { client } = this.props;
        const { searchCustomers } = this.props.actions;
        searchCustomers({ client });
    }

    render() {
        const { customer, client } = this.props;
        const { customerList, customerForm } = customer;
        const {
            loading,
            error,
            customers,
            current,
            pageSize,
            total
        } = customerList;
        const { visible, editingCustomer, isNew } = customerForm;
        const {
            newCustomerForm,
            changeCustomersPage,
            createCustomer,
            closeCustomerForm,
            searchCustomers,
            deleteCustomer,
            editCustomerForm,
            updateCustomer
        } = this.props.actions;

        const customerHeaderProps = {
            createCustomer,
            newCustomerForm,
            searchCustomers,
            deleteCustomer
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
            deleteCustomer
        };

        const customerFormProps = {
            visible,
            client,
            title: i18n.__(isNew ? "customer-add" : "customer-update"),
            onOk: isNew ? createCustomer : updateCustomer,
            onCancel: closeCustomerForm,
            okText: i18n.__(isNew ? "create" : "update"),
            cancelText: i18n.__("cancel"),
            editingCustomer
        };

        return (
            <div>
                <CustomerHeader {...customerHeaderProps} />
                <CustomerList {...customerListProps} />
                <CustomerForm {...customerFormProps} />
            </div>
        );
    }
}

CustomerPage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient).isRequired
};

export default CustomerPage;
