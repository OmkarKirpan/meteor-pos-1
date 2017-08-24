import "./index.scss";

import { Icon, Menu } from "antd";
import React, { Component } from "react";

import ChangePasswordForm from "../ChangePasswordForm";
import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class AppHeader extends Component {
    render() {
        const {
            currentUser,
            changePasswordFormVisible,
            logout,
            toggleSidebar,
            sidebarCollapsed,
            openChangePasswordForm,
            closeChangePasswordForm
        } = this.props;

        const changePasswordFormProps = {
            visible: changePasswordFormVisible,
            closeChangePasswordForm,
            logout
        };

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
                        onClick={e => {
                            e.key === "logout" && logout();
                            e.key === "changePassword" &&
                                openChangePasswordForm();
                        }}
                    >
                        <Menu.SubMenu
                            style={{
                                float: "right"
                            }}
                            title={
                                <span>
                                    <Icon type="user" />
                                    {currentUser ? currentUser.username : ""}
                                </span>
                            }
                        >
                            <Menu.Item key="changePassword">
                                {i18n.__("change-password")}
                            </Menu.Item>
                            <Menu.Item key="logout">
                                {i18n.__("sign-out")}
                            </Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </div>
                <ChangePasswordForm {...changePasswordFormProps} />
            </div>
        );
    }
}

AppHeader.propTypes = {
    currentUser: PropTypes.object,
    changePasswordFormVisible: PropTypes.bool,
    logout: PropTypes.func,
    sidebarCollapsed: PropTypes.bool,
    openChangePasswordForm: PropTypes.func,
    closeChangePasswordForm: PropTypes.func
};

export default AppHeader;
