import PropTypes from "prop-types";
import React from "react";

const AppHeader = ({
    user,
    logout,
    toggleSidebar,
    sidebarCollapsed,
    toggleUserMenu,
    userMenuOpened
}) => {
    return <header className="app-header navbar" />;
};

AppHeader.propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func,
    toggleSidebar: PropTypes.func,
    sidebarCollapsed: PropTypes.bool
};

export default AppHeader;
