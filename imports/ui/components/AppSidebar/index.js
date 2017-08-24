import "./index.scss";

import { Icon, Layout, Menu } from "antd";

import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

const AppSidebar = ({ sidebarCollapsed, toggleSidebar, menu, location }) => {
    const { pathname } = location;
    const openKeys = [];
    const selectedKeys = [];

    const menuToRender = menu.map(m => {
        const { name, path, icon, exact, subMenus } = m;

        if (path === pathname) {
            selectedKeys.push(name);
        }

        return exact
            ? <Menu.Item key={name} name={name}>
                  <NavLink exact={exact} to={path}>
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
                  {subMenus.map(subMenu => {
                      if (subMenu.path === pathname) {
                          selectedKeys.push(subMenu.name);
                          openKeys.push(name);
                      }

                      return (
                          <Menu.Item key={subMenu.name} name={subMenu.name}>
                              <NavLink exact={subMenu.exact} to={subMenu.path}>
                                  <Icon type={subMenu.icon} />
                                  <span>
                                      {subMenu.name}
                                  </span>
                              </NavLink>
                          </Menu.Item>
                      );
                  })}
              </Menu.SubMenu>;
    });

    return (
        <Layout.Sider
            className="sider"
            collapsed={sidebarCollapsed}
            trigger={null}
        >
            <div className="logo">
                <img alt={"logo"} src="/logo.png" />
            </div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={selectedKeys}
                defaultOpenKeys={openKeys}
            >
                {menuToRender}
            </Menu>
        </Layout.Sider>
    );
};

AppSidebar.propTypes = {
    menu: PropTypes.array,
    sidebarCollapsed: PropTypes.bool,
    toggleSidebar: PropTypes.func,
    location: PropTypes.object
};

AppSidebar.__ANT_LAYOUT_SIDER = true;

export default AppSidebar;
