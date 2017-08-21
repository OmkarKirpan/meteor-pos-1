import "antd/dist/antd.css";

import { ApolloProvider } from "react-apollo";
import { LocaleProvider } from "antd";
import React from "react";
import Router from "./routes";
import { client } from "./graphql";
import enUS from "antd/lib/locale-provider/en_US";
import { store } from "./store";

const App = () => {
    return (
        <LocaleProvider locale={enUS}>
            <ApolloProvider store={store} client={client}>
                <Router />
            </ApolloProvider>
        </LocaleProvider>
    );
};

export default App;
