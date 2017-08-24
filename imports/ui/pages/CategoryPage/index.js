import "./index.scss";

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
import { Row } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ category }) => {
    return { category };
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
            <Row>
                <Row className="category-page-header">
                    <CategoryHeader {...categoryHeaderProps} />
                </Row>
                <Row>
                    <CategoryList {...categoryListProps} />
                </Row>
                <Row>
                    <CategoryForm {...categoryFormProps} />
                </Row>
            </Row>
        );
    }
}

CategoryPage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient)
};

export default CategoryPage;
