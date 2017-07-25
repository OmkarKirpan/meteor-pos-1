import { CategoryForm, CategoryHeader, CategoryList } from "../../components";
import React, { Component } from "react";
import {
    changeCategoriesPage,
    changeCategoryForm,
    closeCategoryForm,
    editCategoryForm,
    newCategoryForm,
    searchCategories
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ customer, category }) => {
    return { customer, category };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                changeCategoriesPage,
                closeCategoryForm,
                editCategoryForm,
                newCategoryForm,
                searchCategories,
                changeCategoryForm
            },
            dispatch
        )
    };
};

@compose(withApollo)
@connect(mapStateToProps, mapDispatchToProps)
class CategoryPage extends Component {
    render() {
        const { category, client } = this.props;
        const { categoryList, categoryForm } = category;
        const {
            loading,
            error,
            categories,
            current,
            pageSize,
            total,
            filter
        } = categoryList;
        const { visible, editingCategory, isNew } = categoryForm;
        const {
            newCategoryForm,
            changeCategoriesPage,
            closeCategoryForm,
            searchCategories,
            editCategoryForm,
            changeCategoryForm
        } = this.props.actions;

        const categoryHeaderProps = {
            newCategoryForm,
            searchCategories
        };

        const categoryListProps = {
            loading,
            error,
            categories,
            current,
            pageSize,
            total,
            changeCategoriesPage,
            editCategoryForm,
            filter
        };

        const categoryFormProps = {
            visible,
            isNew,
            closeCategoryForm,
            editingCategory,
            changeCategoryForm
        };

        return (
            <div>
                <CategoryHeader {...categoryHeaderProps} />
                <CategoryList {...categoryListProps} />
                <CategoryForm {...categoryFormProps} />
            </div>
        );
    }
}

CategoryPage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient).isRequired
};

export default CategoryPage;
