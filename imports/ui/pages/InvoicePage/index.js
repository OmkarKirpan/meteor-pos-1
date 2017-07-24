import { InvoiceForm, InvoiceHeader, InvoiceList } from "../../components";
import React, { Component } from "react";
import {
    changeInvoicesPage,
    closeInvoiceForm,
    createInvoice,
    deleteInvoice,
    editInvoiceForm,
    fetchInvoices,
    newInvoiceForm,
    searchInvoices,
    updateInvoice
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ customer, invoice }) => {
    return { customer, invoice };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                changeInvoicesPage,
                closeInvoiceForm,
                createInvoice,
                deleteInvoice,
                editInvoiceForm,
                fetchInvoices,
                newInvoiceForm,
                searchInvoices,
                updateInvoice
            },
            dispatch
        )
    };
};

@compose(withApollo)
@connect(mapStateToProps, mapDispatchToProps)
class InvoicePage extends Component {
    componentWillMount() {
        const { client } = this.props;
        const { searchInvoices } = this.props.actions;
        searchInvoices({ client });
    }

    render() {
        const { invoice, client } = this.props;
        const { invoiceList, invoiceForm } = invoice;
        const {
            loading,
            error,
            invoices,
            current,
            pageSize,
            total
        } = invoiceList;
        const { visible, editingInvoice, isNew } = invoiceForm;
        const {
            newInvoiceForm,
            changeInvoicesPage,
            createInvoice,
            closeInvoiceForm,
            searchInvoices,
            deleteInvoice,
            editInvoiceForm,
            updateInvoice
        } = this.props.actions;

        const invoiceHeaderProps = {
            createInvoice,
            newInvoiceForm,
            searchInvoices
        };

        const invoiceListProps = {
            loading,
            error,
            invoices,
            current,
            pageSize,
            total,
            changeInvoicesPage,
            editInvoiceForm,
            deleteInvoice
        };

        const invoiceFormProps = {
            visible,
            client,
            title: i18n.__(isNew ? "invoice-add" : "invoice-update"),
            onOk: isNew ? createInvoice : updateInvoice,
            onCancel: closeInvoiceForm,
            okText: i18n.__(isNew ? "create" : "update"),
            cancelText: i18n.__("cancel"),
            editingInvoice
        };

        return (
            <div>
                <InvoiceHeader {...invoiceHeaderProps} />
                <InvoiceList {...invoiceListProps} />
                <InvoiceForm {...invoiceFormProps} />
            </div>
        );
    }
}

InvoicePage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient).isRequired
};

export default InvoicePage;
