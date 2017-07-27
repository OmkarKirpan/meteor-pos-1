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
    editInventoryForm,
    newInventoryForm,
    searchInventories,
    searchInventoryCategories
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ inventory }) => {
    return { inventory };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                changeInventoriesPage,
                closeInventoryForm,
                editInventoryForm,
                newInventoryForm,
                searchInventories,
                searchInventoryCategories,
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
            editInventoryForm,
            searchInventoryCategories,
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
            filter
        };

        const inventoryFormProps = {
            categories,
            visible,
            isNew,
            closeInventoryForm,
            editingInventory,
            searchInventoryCategories,
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
