import React, { Component } from "react";
import { logout, toggleSidebar } from "../../actions";

import { AppSidebar } from "../../components";
import { Layout } from "antd";
import LoginForm from "../../components/LoginForm";
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
                toggleSidebar
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

        const sidebarProps = {
            menu: MENUS,
            sidebarCollapsed,
            toggleSidebar
        };

        return (
            <Layout>
                <AppSidebar {...sidebarProps} />
                <Layout>
                    <LoginForm />
                    <Layout.Header style={{ background: "#fff", padding: 0 }} />
                    <Layout.Content style={{ margin: "50px 50px 0" }}>
                        <div style={{ padding: 24, background: "#fff" }}>
                            {this.props.children}
                        </div>
                    </Layout.Content>
                    <Layout.Footer style={{ textAlign: "center" }}>
                        Ant Design ©2016 Created by Ant UED
                    </Layout.Footer>
                </Layout>
            </Layout>
        );
    }
}

export default App;
