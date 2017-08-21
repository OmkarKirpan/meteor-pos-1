import "./index.scss";

import {
    ItemAdjustmentForm,
    ItemAdjustmentHeader,
    ItemAdjustmentList
} from "../../components";
import React, { Component } from "react";
import {
    changeItemAdjustmentForm,
    changeItemAdjustmentsPage,
    closeItemAdjustmentForm,
    editItemAdjustmentForm,
    newItemAdjustmentForm,
    searchItemAdjustmentItems,
    searchItemAdjustments
} from "../../actions";
import { compose, withApollo } from "react-apollo";

import { ApolloClient } from "apollo-client";
import ItemAdjustmentItemForm from "../";
import PropTypes from "prop-types";
import { Row } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ itemAdjustment }) => {
    return { itemAdjustment };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                changeItemAdjustmentsPage,
                closeItemAdjustmentForm,
                editItemAdjustmentForm,
                newItemAdjustmentForm,
                searchItemAdjustments,
                changeItemAdjustmentForm,
                searchItemAdjustmentItems
            },
            dispatch
        )
    };
};

@compose(withApollo)
@connect(mapStateToProps, mapDispatchToProps)
class ItemAdjustmentPage extends Component {
    render() {
        const { itemAdjustment, client } = this.props;

        const {
            itemAdjustmentList,
            itemAdjustmentForm,
            itemAdjustmentItemForm
        } = itemAdjustment;

        const {
            loading,
            error,
            itemAdjustments,
            current,
            pageSize,
            total,
            filter
        } = itemAdjustmentList;

        const {
            visible,
            editingItemAdjustment,
            isNew,
            items
        } = itemAdjustmentForm;

        const {
            newItemAdjustmentForm,
            changeItemAdjustmentsPage,
            closeItemAdjustmentForm,
            searchItemAdjustments,
            editItemAdjustmentForm,
            changeItemAdjustmentForm,
            searchItemAdjustmentItems
        } = this.props.actions;

        const itemAdjustmentHeaderProps = {
            newItemAdjustmentForm,
            searchItemAdjustments,
            filter
        };

        const itemAdjustmentListProps = {
            loading,
            error,
            itemAdjustments,
            current,
            pageSize,
            total,
            changeItemAdjustmentsPage,
            editItemAdjustmentForm,
            filter
        };

        const itemAdjustmentFormProps = {
            visible,
            isNew,
            closeItemAdjustmentForm,
            editingItemAdjustment,
            searchItemAdjustmentItems,
            changeItemAdjustmentForm,
            items
        };

        return (
            <Row>
                <Row className="itemAdjustment-page-header">
                    <ItemAdjustmentHeader {...itemAdjustmentHeaderProps} />
                </Row>
                <Row>
                    <ItemAdjustmentList {...itemAdjustmentListProps} />
                </Row>
                <Row>
                    <ItemAdjustmentForm {...itemAdjustmentFormProps} />
                </Row>
            </Row>
        );
    }
}

ItemAdjustmentPage.proptypes = {
    client: PropTypes.instanceOf(ApolloClient).isRequired
};

export default ItemAdjustmentPage;
