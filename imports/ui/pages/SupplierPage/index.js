import React, { Component } from "react";
import { SupplierForm, SupplierHeader, SupplierList } from "../../components";
import {
    changeSuppliersPage,
    closeSupplierForm,
    createSupplier,
    deleteSupplier,
    editSupplierForm,
    fetchSuppliers,
    newSupplierForm,
    searchSuppliers,
    updateSupplier
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ supplier }) => {
    return { supplier };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                changeSuppliersPage,
                closeSupplierForm,
                createSupplier,
                deleteSupplier,
                editSupplierForm,
                fetchSuppliers,
                newSupplierForm,
                searchSuppliers,
                updateSupplier
            },
            dispatch
        )
    };
};

@compose(withApollo)
@connect(mapStateToProps, mapDispatchToProps)
class SupplierPage extends Component {
    componentWillMount() {
        const { client } = this.props;
        const { searchSuppliers } = this.props.actions;
        searchSuppliers({ client });
    }

    render() {
        const { supplier, client } = this.props;
        const { supplierList, supplierForm } = supplier;
        const {
            loading,
            error,
            suppliers,
            current,
            pageSize,
            total
        } = supplierList;
        const { visible, editingSupplier, isNew } = supplierForm;
        const {
            newSupplierForm,
            changeSuppliersPage,
            createSupplier,
            closeSupplierForm,
            searchSuppliers,
            deleteSupplier,
            editSupplierForm,
            updateSupplier
        } = this.props.actions;

        const supplierHeaderProps = {
            createSupplier,
            newSupplierForm,
            searchSuppliers,
            deleteSupplier
        };

        const supplierListProps = {
            loading,
            error,
            suppliers,
            current,
            pageSize,
            total,
            changeSuppliersPage,
            editSupplierForm,
            deleteSupplier
        };

        const supplierFormProps = {
            visible,
            client,
            title: i18n.__(isNew ? "supplier-add" : "supplier-update"),
            onOk: isNew ? createSupplier : updateSupplier,
            onCancel: closeSupplierForm,
            okText: i18n.__(isNew ? "create" : "update"),
            cancelText: i18n.__("cancel"),
            editingSupplier
        };

        return (
            <div>
                <SupplierHeader {...supplierHeaderProps} />
                <SupplierList {...supplierListProps} />
                <SupplierForm {...supplierFormProps} />
            </div>
        );
    }
}

SupplierPage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient).isRequired
};

export default SupplierPage;
