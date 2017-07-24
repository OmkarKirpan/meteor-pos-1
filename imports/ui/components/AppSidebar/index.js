import { Icon, Layout, Menu } from "antd";

import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

const AppSidebar = ({ sidebarCollapsed, toggleSidebar, menu }) => {
    const menuToRender = menu.map(m => {
        const { name, path, icon, exact, subMenus } = m;
        return exact
            ? <Menu.Item key={name} name={name}>
                  <NavLink className="nav-text" exact={exact} to={path}>
                      <Icon type={icon} />
                      <span>
                          {name}
                      </span>
                  </NavLink>
              </Menu.Item>
            : <Menu.SubMenu
                  key={name}
                  title={
                      <div>
                          <Icon type={icon} /> <span>{name}</span>
                      </div>
                  }
              >
                  {subMenus.map(subMenu =>
                      <Menu.Item key={subMenu.name} name={subMenu.name}>
                          <NavLink
                              className="nav-text"
                              exact={subMenu.exact}
                              to={subMenu.path}
                          >
                              <Icon type={subMenu.icon} />
                              <span>
                                  {subMenu.name}
                              </span>
                          </NavLink>
                      </Menu.Item>
                  )}
              </Menu.SubMenu>;
    });

    return (
        <Layout.Sider
            breakpoint="xl"
            collapsedWidth="0"
            collapsed={sidebarCollapsed}
            onCollapse={toggleSidebar}
        >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["Home"]}>
                {menuToRender}
            </Menu>
        </Layout.Sider>
    );
};

AppSidebar.propTypes = {
    menu: PropTypes.array,
    sidebarCollapsed: PropTypes.bool
};

AppSidebar.__ANT_LAYOUT_SIDER = true;

export default AppSidebar;
