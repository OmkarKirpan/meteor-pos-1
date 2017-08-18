import "./index.scss";

import { AppFooter, AppHeader, AppSidebar } from "../../components";
import React, { Component } from "react";
import { logout, toggleSidebar } from "../../actions";

import { Layout } from "antd";
import { MENUS } from "../../configs";
import { Meteor } from "meteor/meteor";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class AuthenticatedWrapper extends Component {}

const mapStateToProps = ({ app }) => {
    return { app };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                toggleSidebar,
                logout
            },
            dispatch
        )
    };
};
@connect(mapStateToProps, mapDispatchToProps)
class App extends Component {
    render() {
        const { logout, toggleSidebar } = this.props.actions;
        const { app } = this.props;
        const { sidebarCollapsed } = app;
        const user = Meteor.user();

        const headerProps = {
            user,
            logout,
            sidebarCollapsed,
            toggleSidebar
        };

        const sidebarProps = {
            menu: MENUS,
            sidebarCollapsed,
            toggleSidebar
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
