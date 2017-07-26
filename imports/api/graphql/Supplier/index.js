import Suppliers from "../../../domain/Supplier/repository";
import commands from "../../../domain/Supplier/commands";
import events from "../../../domain/Supplier/events";
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

const { CreateSupplier, UpdateSupplier } = commands;

const { SupplierCreated, SupplierUpdated } = events;

const queryResolver = {
    Query: {
        suppliers(_, { filter, skip, pageSize }, context) {
            let { name } = filter || {};
            let queryFilter = {};
            if (name) queryFilter["name"] = { $regex: ".*" + name + ".*" };
            return Suppliers.find(queryFilter, {
                skip,
                limit: pageSize,
                sort: {
                    createdAt: -1
                }
            }).fetch();
        },
        SupplierCount(_, { filter }, context) {
            let { name } = filter || {};
            let queryFilter = {};
            if (name) queryFilter["name"] = name;
            return Suppliers.find(queryFilter).count();
        },
        Supplier(_, { _id }, context) {
            return Suppliers.findOne({ _id });
        }
    }
};

const mutationResolver = {
    Mutation: {
        createSupplier(_, { supplier }, context) {
            let { name, address, phoneNumber } = supplier;
            let _id = uuid.v4();
            let createSupplierCommand = new CreateSupplier({
                targetId: _id,
                _id,
                name,
                address,
                phoneNumber,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            SupplierApi.send(createSupplierCommand);
            return _id;
        },
        updateSupplier(_, { supplier }, context) {
            let { _id, name, address, phoneNumber } = supplier;
            let updateSupplierCommand = new UpdateSupplier({
                targetId: _id,
                _id,
                name,
                address,
                phoneNumber,
                updatedAt: new Date()
            });
            SupplierApi.send(updateSupplierCommand);
            return _id;
        }
    }
};

const subscriptionResolver = {
    Subscription: {
        SupplierEvent: {
            subscribe: withFilter(
                () =>
                    pubsub.asyncIterator([
                        [SupplierCreated],
                        [SupplierUpdated]
                    ]),
                (payload, variables) => {
                    let { supplierIds } = variables;
                    if (payload instanceof SupplierUpdated)
                        return supplierIds.indexOf(payload._id) > -1;
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                let data = {};
                if (payload instanceof SupplierCreated)
                    data[[SupplierCreated]] = payload;
                else if (payload instanceof SupplierUpdated)
                    data[[SupplierUpdated]] = payload;
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
