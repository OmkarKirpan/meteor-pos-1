import "./index.scss";

import { ItemForm, ItemHeader, ItemList } from "../../components";
import React, { Component } from "react";
import {
    changeItemForm,
    changeItemsPage,
    closeItemForm,
    editItemForm,
    newItemForm,
    searchItemBrands,
    searchItemCategories,
    searchItems
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import PropTypes from "prop-types";
import { Row } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ item }) => {
    return { item };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                changeItemsPage,
                closeItemForm,
                editItemForm,
                newItemForm,
                searchItems,
                searchItemCategories,
                changeItemForm,
                searchItemBrands
            },
            dispatch
        )
    };
};

@compose(withApollo)
@connect(mapStateToProps, mapDispatchToProps)
class ItemPage extends Component {
    render() {
        const { item, client } = this.props;
        const { itemList, itemForm } = item;
        const {
            loading,
            error,
            items,
            current,
            pageSize,
            total,
            filter
        } = itemList;
        const { visible, editingItem, isNew, categories, brands } = itemForm;
        const {
            newItemForm,
            changeItemsPage,
            closeItemForm,
            searchItems,
            editItemForm,
            searchItemCategories,
            changeItemForm,
            searchItemBrands
        } = this.props.actions;

        const itemHeaderProps = {
            newItemForm,
            searchItems
        };

        const itemListProps = {
            loading,
            error,
            items,
            current,
            pageSize,
            total,
            changeItemsPage,
            editItemForm,
            filter
        };

        const itemFormProps = {
            categories,
            brands,
            visible,
            isNew,
            closeItemForm,
            editingItem,
            searchItemCategories,
            searchItemBrands,
            changeItemForm
        };

        return (
            <Row>
                <Row className="item-page-header">
                    <ItemHeader {...itemHeaderProps} />
                </Row>
                <Row>
                    <ItemList {...itemListProps} />
                </Row>
                <Row>
                    <ItemForm {...itemFormProps} />
                </Row>
            </Row>
        );
    }
}

ItemPage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient)
};

export default ItemPage;
