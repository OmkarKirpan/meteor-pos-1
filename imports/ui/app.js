import "antd/dist/antd.css";

import { Accounts } from "meteor/accounts-base";
import { ApolloProvider } from "react-apollo";
import React from "react";
import Router from "./routes";
import { client } from "./graphql";
import { store } from "./store";

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

const App = () => {
    return (
        <ApolloProvider store={store} client={client}>
            <Router />
        </ApolloProvider>
    );
};

export default App;
