import "./index.scss";

import { AppFooter, AppHeader, AppSidebar } from "../../components";
import React, { Component } from "react";
import {
    closeChangePasswordForm,
    logout,
    openChangePasswordForm,
    toggleSidebar
} from "../../actions";

import { Layout } from "antd";
import { MENUS } from "../../configs";
import { Meteor } from "meteor/meteor";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class AuthenticatedWrapper extends Component {}

const mapStateToProps = ({ app, session }) => {
    return { app, session };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                toggleSidebar,
                logout,
                openChangePasswordForm,
                closeChangePasswordForm
            },
            dispatch
        )
    };
};
@connect(mapStateToProps, mapDispatchToProps)
class App extends Component {
    render() {
        const {
            logout,
            toggleSidebar,
            openChangePasswordForm,
            closeChangePasswordForm
        } = this.props.actions;
        const { app, session, location } = this.props;
        const { changePasswordForm } = session;
        const { sidebarCollapsed } = app;

        const currentUser = Meteor.user();

        const headerProps = {
            currentUser,
            logout,
            sidebarCollapsed,
            toggleSidebar,
            changePasswordFormVisible: changePasswordForm.visible,
            openChangePasswordForm,
            closeChangePasswordForm
        };

        const sidebarProps = {
            menu: MENUS,
            sidebarCollapsed,
            toggleSidebar,
            location
        };

        return (
            <Layout className="main-layout">
                <AppSidebar {...sidebarProps} />
                <div className="main">
                    <AppHeader {...headerProps} />
                    <Layout.Content style={{ margin: "50px 50px 0" }}>
                        <div style={{ padding: 24, background: "#fff" }}>
                            {this.props.children}
                        </div>
                    </Layout.Content>
                    <AppFooter />
                </div>
            </Layout>
        );
    }
}

export default App;
