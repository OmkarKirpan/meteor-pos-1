import { ENTITYSTATUS } from "../../../constants";
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

const {
    CreateSupplier,
    UpdateSupplier,
    ActivateSupplier,
    DeactivateSupplier
} = commands;

const {
    SupplierCreated,
    SupplierUpdated,
    SupplierActivated,
    SupplierDeactivated
} = events;

const queryResolver = {
    Query: {
        suppliers(_, { filter, skip, pageSize }, context) {
            const { name, entityStatus } = filter || {};
            const queryFilter = {};
            if (name) queryFilter["name"] = { $regex: ".*" + name + ".*" };
            if (entityStatus !== undefined)
                queryFilter["entityStatus"] = { $eq: entityStatus };
            return Suppliers.find(queryFilter, {
                skip,
                limit: pageSize,
                sort: {
                    createdAt: -1
                }
            }).fetch();
        },
        supplierCount(_, { filter }, context) {
            const { name, entityStatus } = filter || {};
            const queryFilter = {};
            if (name) queryFilter["name"] = { $regex: ".*" + name + ".*" };
            if (entityStatus !== undefined)
                queryFilter["entityStatus"] = { $eq: entityStatus };
            return Suppliers.find(queryFilter).count();
        },
        supplier(_, { _id }, context) {
            return Suppliers.findOne({ _id });
        }
    }
};

const mutationResolver = {
    Mutation: {
        async createSupplier(_, { supplier }, context) {
            const { name, address, phoneNumber, cellphoneNumber } = supplier;
            const _id = uuid.v4();
            const createSupplierCommand = new CreateSupplier({
                targetId: _id,
                _id,
                name,
                address,
                phoneNumber,
                cellphoneNumber,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            SupplierApi.send(createSupplierCommand);
            return _id;
        },
        async updateSupplier(_, { supplier }, context) {
            const {
                _id,
                name,
                address,
                phoneNumber,
                cellphoneNumber
            } = supplier;
            const updateSupplierCommand = new UpdateSupplier({
                targetId: _id,
                _id,
                name,
                address,
                phoneNumber,
                cellphoneNumber,
                updatedAt: new Date()
            });
            SupplierApi.send(updateSupplierCommand);
            return _id;
        },
        async updateSupplierStatus(_, { _id, newStatus }) {
            const updateStatusCommand =
                newStatus === ENTITYSTATUS.ACTIVE
                    ? new ActivateSupplier({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      })
                    : new DeactivateSupplier({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      });
            SupplierApi.send(updateStatusCommand);
            return _id;
        }
    }
};

const subscriptionResolver = {
    Subscription: {
        supplierEvent: {
            subscribe: withFilter(
                () =>
                    pubsub.asyncIterator([
                        [SupplierCreated],
                        [SupplierUpdated],
                        [SupplierActivated],
                        [SupplierDeactivated]
                    ]),
                (payload, variables) => {
                    const { supplierIds } = variables;
                    if (
                        payload instanceof SupplierUpdated ||
                        payload instanceof SupplierActivated ||
                        payload instanceof SupplierDeactivated
                    )
                        return supplierIds.indexOf(payload._id) > -1;
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                const data = {};
                if (payload instanceof SupplierCreated)
                    data[[SupplierCreated]] = payload;
                else if (payload instanceof SupplierUpdated)
                    data[[SupplierUpdated]] = payload;
                else if (payload instanceof SupplierActivated)
                    data[[SupplierActivated]] = payload;
                else if (payload instanceof SupplierDeactivated)
                    data[[SupplierDeactivated]] = payload;
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
