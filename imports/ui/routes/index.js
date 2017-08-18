import {
    App,
    BrandPage,
    CategoryPage,
    CustomerPage,
    DashboardPage,
    ItemPage,
    LoginPage,
    OrderPage,
    SupplierPage,
    UserPage
} from "../pages";
import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { ApolloProvider } from "react-apollo";
import { ConnectedRouter } from "react-router-redux";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import { history } from "../store";

const appRoutes = [
    {
        path: "/",
        name: "Home",
        component: DashboardPage,
        exact: true
    },
    {
        path: "/items",
        name: "Items",
        component: ItemPage,
        exact: true
    },
    {
        path: "/categories",
        name: "Categories",
        component: CategoryPage,
        exact: true
    },
    {
        path: "/customers",
        name: "Customers",
        component: CustomerPage,
        exact: true
    },
    {
        path: "/suppliers",
        name: "Suppliers",
        component: SupplierPage,
        exact: true
    },
    {
        path: "/orders",
        name: "Orders",
        component: OrderPage,
        exact: true
    },
    {
        path: "/brands",
        name: "Brands",
        component: BrandPage,
        exact: true
    },
    {
        path: "/users",
        name: "Users",
        component: UserPage,
        exact: true
    }
];

const NotAuthenticatedWrapper = componentToRender => {
    return createContainer(
        params => {
            return { currentUser: Meteor.user() };
        },
        props => {
            const { currentUser } = props;
            return currentUser !== null
                ? <Redirect to="/" />
                : <componentToRender.component {...props} />;
        }
    );
};

const AuthenticatedWrapper = componentToRender => {
    return createContainer(
        params => {
            return { currentUser: Meteor.user() };
        },
        props => {
            const { currentUser } = props;
            return currentUser === null
                ? <Redirect to="/login" />
                : <componentToRender.component {...props} />;
        }
    );
};

const routes = [
    {
        path: "/login",
        component: NotAuthenticatedWrapper({ component: LoginPage }),
        exact: true
    },
    {
        path: "/",
        component: AuthenticatedWrapper({ component: App }),
        exact: false,
        routes: appRoutes
    }
];

const RoutesWithSubs = route => {
    return (
        <Route
            exact={route.exact}
            path={route.path}
            render={props =>
                <route.component {...props} children={route.children} />}
        />
    );
};

const AppRouter = props =>
    <ConnectedRouter history={history}>
        <Switch>
            {routes.map((route, i) =>
                <RoutesWithSubs
                    key={i}
                    {...route}
                    children={
                        !route.routes
                            ? null
                            : route.routes.map((subRoute, j) =>
                                  <RoutesWithSubs key={j} {...subRoute} />
                              )
                    }
                />
            )}
        </Switch>
    </ConnectedRouter>;

export default AppRouter;
