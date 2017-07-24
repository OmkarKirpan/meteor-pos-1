import {
    InventoryForm,
    InventoryHeader,
    InventoryList
} from "../../components";
import React, { Component } from "react";
import {
    changeInventoriesPage,
    changeInventoryForm,
    closeInventoryForm,
    deleteInventory,
    editInventoryForm,
    newInventoryForm,
    searchCategories,
    searchInventories
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ customer, inventory }) => {
    return { customer, inventory };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                changeInventoriesPage,
                closeInventoryForm,
                deleteInventory,
                editInventoryForm,
                newInventoryForm,
                searchInventories,
                searchCategories,
                changeInventoryForm
            },
            dispatch
        )
    };
};

@compose(withApollo)
@connect(mapStateToProps, mapDispatchToProps)
class InventoryPage extends Component {
    render() {
        const { inventory, client } = this.props;
        const { inventoryList, inventoryForm } = inventory;
        const {
            loading,
            error,
            inventories,
            current,
            pageSize,
            total,
            filter
        } = inventoryList;
        const { visible, editingInventory, isNew, categories } = inventoryForm;
        const {
            newInventoryForm,
            changeInventoriesPage,
            closeInventoryForm,
            searchInventories,
            deleteInventory,
            editInventoryForm,
            searchCategories,
            changeInventoryForm
        } = this.props.actions;

        const inventoryHeaderProps = {
            newInventoryForm,
            searchInventories
        };

        const inventoryListProps = {
            loading,
            error,
            inventories,
            current,
            pageSize,
            total,
            changeInventoriesPage,
            editInventoryForm,
            deleteInventory,
            filter
        };

        const inventoryFormProps = {
            categories,
            visible,
            isNew,
            closeInventoryForm,
            editingInventory,
            searchCategories,
            changeInventoryForm
        };

        return (
            <div>
                <InventoryHeader {...inventoryHeaderProps} />
                <InventoryList {...inventoryListProps} />
                <InventoryForm {...inventoryFormProps} />
            </div>
        );
    }
}

InventoryPage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient).isRequired
};

export default InventoryPage;
