import { BrandForm, BrandHeader, BrandList } from "../../components";
import React, { Component } from "react";
import {
    changeBrandForm,
    changeBrandsPage,
    closeBrandForm,
    editBrandForm,
    newBrandForm,
    searchBrands
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ brand }) => {
    return { brand };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                changeBrandsPage,
                closeBrandForm,
                editBrandForm,
                newBrandForm,
                searchBrands,
                changeBrandForm
            },
            dispatch
        )
    };
};

@compose(withApollo)
@connect(mapStateToProps, mapDispatchToProps)
class BrandPage extends Component {
    render() {
        const { brand, client } = this.props;
        const { brandList, brandForm } = brand;
        const {
            loading,
            error,
            brands,
            current,
            pageSize,
            total,
            filter
        } = brandList;
        const { visible, editingBrand, isNew } = brandForm;
        const {
            newBrandForm,
            changeBrandsPage,
            closeBrandForm,
            searchBrands,
            editBrandForm,
            changeBrandForm
        } = this.props.actions;

        const brandHeaderProps = {
            newBrandForm,
            searchBrands
        };

        const brandListProps = {
            loading,
            error,
            brands,
            current,
            pageSize,
            total,
            changeBrandsPage,
            editBrandForm,
            filter
        };

        const brandFormProps = {
            visible,
            isNew,
            closeBrandForm,
            editingBrand,
            changeBrandForm
        };

        return (
            <div>
                <BrandHeader {...brandHeaderProps} />
                <BrandList {...brandListProps} />
                <BrandForm {...brandFormProps} />
            </div>
        );
    }
}

BrandPage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient).isRequired
};

export default BrandPage;
