import { execute, subscribe } from "graphql";
import { resolvers, typeDefs } from "../imports/api/graphql";

import ServerApp from "../imports/api/space";
import { SubscriptionServer } from "subscriptions-transport-ws";
import cors from "cors";
import { createApolloServer } from "meteor/apollo";
import { initPrinter } from "../imports/util/printing";
import { makeExecutableSchema } from "graphql-tools";

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const context = {};

createApolloServer(
    {
        schema,
        context
    },
    {
        configServer: expressServer => expressServer.use(cors()),
        graphiql: false
    }
);

SubscriptionServer.create(
    {
        schema,
        execute,
        subscribe
    },
    {
        server: WebApp.httpServer,
        path: "/subscriptions"
    }
);

Meteor.startup(function() {
    if (Meteor.isServer) {
        initPrinter();
        ServerApp.start();
    }
});
