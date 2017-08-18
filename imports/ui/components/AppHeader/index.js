import "./index.scss";

import { Icon, Menu } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";

class AppHeader extends Component {
    render() {
        const { user, logout, toggleSidebar, sidebarCollapsed } = this.props;
        return (
            <div className="header">
                <div className="button" onClick={toggleSidebar}>
                    <Icon
                        type={sidebarCollapsed ? "menu-unfold" : "menu-fold"}
                    />
                </div>
                <div className="rightWrapper">
                    <Menu
                        mode="horizontal"
                        onClick={e => e.key === "logout" && logout()}
                    >
                        <Menu.SubMenu
                            style={{
                                float: "right"
                            }}
                            title={
                                <span>
                                    <Icon type="user" />
                                    {user ? user.username : ""}
                                </span>
                            }
                        >
                            <Menu.Item key="changePassword">
                                Change password
                            </Menu.Item>
                            <Menu.Item key="logout">Sign out</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </div>
            </div>
        );
    }
}

AppHeader.propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func,
    toggleSidebar: PropTypes.func
};

export default AppHeader;
