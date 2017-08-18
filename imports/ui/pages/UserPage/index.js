import React, { Component } from "react";
import { UserForm, UserHeader, UserList } from "../../components";
import { changeUsersPage, searchUsers } from "../../actions";

import { ApolloClient } from "apollo-client";
import PropTypes from "prop-types";
import { Row } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

const mapStateToProps = ({ user }) => {
    return { user };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                changeUsersPage,
                searchUsers
            },
            dispatch
        )
    };
};

@connect(mapStateToProps, mapDispatchToProps)
class UserPage extends Component {
    render() {
        const { user } = this.props;
        const { userList } = user;
        const {
            loading,
            error,
            users,
            current,
            pageSize,
            total,
            filter
        } = userList;
        const { changeUsersPage, searchUsers } = this.props.actions;

        const userHeaderProps = {
            searchUsers
        };

        const userListProps = {
            loading,
            error,
            users,
            current,
            pageSize,
            total,
            changeUsersPage,
            filter
        };

        return <UserList {...userListProps} />;
    }
}

UserPage.proptypes = {};

export default UserPage;
