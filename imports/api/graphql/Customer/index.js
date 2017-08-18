import Customers from "../../../domain/Customer/repository";
import { ENTITYSTATUS } from "../../../constants";
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
    DeactivateCustomer
} = commands;

const {
    CustomerCreated,
    CustomerUpdated,
    CustomerActivated,
    CustomerDeactivated
} = events;

const queryResolver = {
    Query: {
        customers(_, { filter, skip, pageSize }, context) {
            const { name, entityStatus } = filter || {};
            const queryFilter = {};
            if (name) queryFilter["name"] = { $regex: ".*" + name + ".*" };
            if (entityStatus !== undefined)
                queryFilter["entityStatus"] = { $eq: entityStatus };
            return Customers.find(queryFilter, {
                skip,
                limit: pageSize,
                sort: {
                    createdAt: -1
                }
            }).fetch();
        },
        customerCount(_, { filter }, context) {
            const { name, entityStatus } = filter || {};
            const queryFilter = {};
            if (name) queryFilter["name"] = { $regex: ".*" + name + ".*" };
            if (entityStatus !== undefined)
                queryFilter["entityStatus"] = { $eq: entityStatus };
            return Customers.find(queryFilter).count();
        },
        customer(_, { _id }, context) {
            return Customers.findOne({ _id });
        }
    }
};

const mutationResolver = {
    Mutation: {
        async createCustomer(_, { customer }, context) {
            const { name, address, phoneNumber, cellphoneNumber } = customer;
            const _id = uuid.v4();
            const createCustomerCommand = new CreateCustomer({
                targetId: _id,
                _id,
                name,
                address,
                phoneNumber,
                cellphoneNumber,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            CustomerApi.send(createCustomerCommand);
            return _id;
        },
        async updateCustomer(_, { customer }, context) {
            const {
                _id,
                name,
                address,
                phoneNumber,
                cellphoneNumber
            } = customer;
            const updateCustomerCommand = new UpdateCustomer({
                targetId: _id,
                _id,
                name,
                address,
                phoneNumber,
                cellphoneNumber,
                updatedAt: new Date()
            });
            CustomerApi.send(updateCustomerCommand);
            return _id;
        },
        async updateCustomerStatus(_, { _id, newStatus }) {
            const updateStatusCommand =
                newStatus === ENTITYSTATUS.ACTIVE
                    ? new ActivateCustomer({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      })
                    : new DeactivateCustomer({
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
                        [CustomerDeactivated]
                    ]),
                (payload, variables) => {
                    const { customerIds } = variables;
                    if (
                        payload instanceof CustomerUpdated ||
                        payload instanceof CustomerActivated ||
                        payload instanceof CustomerDeactivated
                    )
                        return customerIds.indexOf(payload._id) > -1;
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                const data = {};
                if (payload instanceof CustomerCreated)
                    data[[CustomerCreated]] = payload;
                else if (payload instanceof CustomerUpdated)
                    data[[CustomerUpdated]] = payload;
                else if (payload instanceof CustomerActivated)
                    data[[CustomerActivated]] = payload;
                else if (payload instanceof CustomerDeactivated)
                    data[[CustomerDeactivated]] = payload;
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
