import Customers from "../../../domain/Customer/repository";
import { RecordStatus } from "../../../constants";
import commands from "../../../domain/Customer/commands";
import events from "../../../domain/Customer/events";
import { extend } from "lodash";
import inputs from "./inputs";
import { mergeTypes } from "merge-graphql-schemas";
import mutations from "./mutations";
import pubsub from "../pubsub";
import queries from "./queries";
import subscriptions from "./subscriptions";
import types from "./types";
import uuid from "uuid";
import { withFilter } from "graphql-subscriptions";

const {
    CreateCustomer,
    UpdateCustomer,
    ActivateCustomer,
    InactivateCustomer
} = commands;

const {
    CustomerCreated,
    CustomerUpdated,
    CustomerActivated,
    CustomerInactivated
} = events;

const queryResolver = {
    Query: {
        customers(_, { filter, skip, pageSize }, context) {
            let { name } = filter || {};
            let queryFilter = {};
            if (name) queryFilter["name"] = { $regex: ".*" + name + ".*" };
            return Customers.find(queryFilter, {
                skip,
                limit: pageSize,
                sort: {
                    createdAt: -1
                }
            }).fetch();
        },
        customerCount(_, { filter }, context) {
            let { name } = filter || {};
            let queryFilter = {};
            if (name) queryFilter["name"] = name;
            return Customers.find(queryFilter).count();
        },
        customer(_, { _id }, context) {
            return Customers.findOne({ _id });
        }
    }
};

const mutationResolver = {
    Mutation: {
        createCustomer(_, { customer }, context) {
            let { name, address, phoneNumber } = customer;
            let _id = uuid.v4();
            let createCustomerCommand = new CreateCustomer({
                targetId: _id,
                _id,
                name,
                address,
                phoneNumber,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            CustomerApi.send(createCustomerCommand);
            return _id;
        },
        updateCustomer(_, { customer }, context) {
            let { _id, name, address, phoneNumber } = customer;
            let updateCustomerCommand = new UpdateCustomer({
                targetId: _id,
                _id,
                name,
                address,
                phoneNumber,
                updatedAt: new Date()
            });
            CustomerApi.send(updateCustomerCommand);
            return _id;
        },
        updateCustomerStatus(_, { _id, newStatus }) {
            let updateStatusCommand =
                newStatus === RecordStatus.ACTIVE
                    ? new ActivateCustomer({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      })
                    : new InactivateCustomer({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      });
            CustomerApi.send(updateStatusCommand);
            return _id;
        }
    }
};

const subscriptionResolver = {
    Subscription: {
        customerEvent: {
            subscribe: withFilter(
                () =>
                    pubsub.asyncIterator([
                        [CustomerCreated],
                        [CustomerUpdated],
                        [CustomerActivated],
                        [CustomerInactivated]
                    ]),
                (payload, variables) => {
                    let { customerIds } = variables;
                    if (
                        payload instanceof CustomerUpdated ||
                        payload instanceof CustomerActivated ||
                        payload instanceof CustomerInactivated
                    )
                        return customerIds.indexOf(payload._id) > -1;
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                let data = {};
                if (payload instanceof CustomerCreated)
                    data[[CustomerCreated]] = payload;
                else if (payload instanceof CustomerUpdated)
                    data[[CustomerUpdated]] = payload;
                else if (payload instanceof CustomerActivated)
                    data[[CustomerActivated]] = payload;
                else if (payload instanceof CustomerInactivated)
                    data[[CustomerInactivated]] = payload;
                return data;
            }
        }
    }
};

export const typeDefs = mergeTypes([
    types,
    inputs,
    queries,
    mutations,
    subscriptions
]);
export const resolver = extend(
    {},
    queryResolver,
    mutationResolver,
    subscriptionResolver
);
