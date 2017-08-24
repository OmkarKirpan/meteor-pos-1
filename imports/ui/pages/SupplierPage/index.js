import "./index.scss";

import React, { Component } from "react";
import { SupplierForm, SupplierHeader, SupplierList } from "../../components";
import {
    changeSupplierForm,
    changeSuppliersPage,
    closeSupplierForm,
    editSupplierForm,
    newSupplierForm,
    searchSuppliers
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import PropTypes from "prop-types";
import { Row } from "antd";
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
                editSupplierForm,
                newSupplierForm,
                searchSuppliers,
                changeSupplierForm
            },
            dispatch
        )
    };
};

@compose(withApollo)
@connect(mapStateToProps, mapDispatchToProps)
class SupplierPage extends Component {
    render() {
        const { supplier, client } = this.props;
        const { supplierList, supplierForm } = supplier;
        const {
            loading,
            error,
            suppliers,
            current,
            pageSize,
            total,
            filter
        } = supplierList;
        const { visible, editingSupplier, isNew } = supplierForm;
        const {
            newSupplierForm,
            changeSuppliersPage,
            closeSupplierForm,
            searchSuppliers,
            editSupplierForm,
            changeSupplierForm
        } = this.props.actions;

        const supplierHeaderProps = {
            newSupplierForm,
            searchSuppliers
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
            filter
        };

        const supplierFormProps = {
            visible,
            isNew,
            closeSupplierForm,
            editingSupplier,
            changeSupplierForm
        };

        return (
            <Row>
                <Row className="supplier-page-header">
                    <SupplierHeader {...supplierHeaderProps} />
                </Row>
                <Row>
                    <SupplierList {...supplierListProps} />
                </Row>
                <Row>
                    <SupplierForm {...supplierFormProps} />
                </Row>
            </Row>
        );
    }
}

SupplierPage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient)
};

export default SupplierPage;
