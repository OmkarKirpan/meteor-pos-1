import { execute, subscribe } from "graphql";
import { resolvers, typeDefs } from "../imports/api/graphql";

import ServerApp from "../imports/api/space";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { createApolloServer } from "meteor/apollo";
import { makeExecutableSchema } from "graphql-tools";

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const context = {};

createApolloServer({
    schema,
    context
});

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
        ServerApp.start();
    }
});
