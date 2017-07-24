import {
    SubscriptionClient,
    addGraphQLSubscriptions
} from "subscriptions-transport-ws";
import {
    createMeteorNetworkInterface,
    getMeteorLoginToken
} from "meteor/apollo";

import ApolloClient from "apollo-client";

const networkInterface = createMeteorNetworkInterface();

const websocketUri = Meteor.absoluteUrl("subscriptions").replace(/^http/, "ws");

const wsClient = new SubscriptionClient(websocketUri, {
    reconnect: true
    // connectionParams: {
    //     meteorLoginToken: getMeteorLoginToken()
    // }
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
);

export const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions
});
