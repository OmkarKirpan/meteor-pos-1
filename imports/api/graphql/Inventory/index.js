import Inventories from "../../../domain/Inventory/repository";
import { RecordStatus } from "../../../constants";
import commands from "../../../domain/Inventory/commands";
import events from "../../../domain/Inventory/events";
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
    CreateInventory,
    UpdateInventory,
    ActivateInventory,
    InactivateInventory
} = commands;

const {
    InventoryCreated,
    InventoryUpdated,
    InventoryActivated,
    InventoryInactivated
} = events;

const queryResolver = {
    Query: {
        inventories(_, { filter, skip, pageSize }, context) {
            let { name } = filter || {};
            let queryFilter = {};
            if (name) queryFilter["name"] = name;
            return Inventories.find(queryFilter, {
                skip,
                limit: pageSize,
                sort: {
                    createdAt: -1
                }
            }).fetch();
        },
        inventoryCount(_, { filter }, context) {
            let { name } = filter || {};
            let queryFilter = {};
            if (name) queryFilter["name"] = name;
            return Inventories.find(queryFilter).count();
        },
        inventory(_, { _id }, context) {
            return Inventories.findOne({ _id });
        }
    }
};

const mutationResolver = {
    Mutation: {
        createInventory(_, { inventory }, context) {
            let { name, basePrice, baseUnit, prices } = inventory;
            let _id = uuid.v4();
            let createInventoryCommand = new CreateInventory({
                targetId: _id,
                _id,
                name,
                basePrice,
                baseUnit,
                prices: prices || [],
                createdAt: new Date(),
                updatedAt: new Date()
            });
            InventoryApi.send(createInventoryCommand);
            return _id;
        },
        updateInventory(_, { inventory }, context) {
            let { _id, name, basePrice, baseUnit, prices } = inventory;
            let updateInventoryCommand = new UpdateInventory({
                targetId: _id,
                _id,
                name,
                basePrice,
                baseUnit,
                prices,
                updatedAt: new Date()
            });
            InventoryApi.send(updateInventoryCommand);
            return _id;
        },
        updateInventoryStatus(_, { _id, newStatus }) {
            let updateStatusCommand =
                newStatus === RecordStatus.ACTIVE
                    ? new ActivateInventory({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      })
                    : new InactivateInventory({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      });
            InventoryApi.send(updateStatusCommand);
            return _id;
        }
    }
};

const subscriptionResolver = {
    Subscription: {
        inventoryEvent: {
            subscribe: withFilter(
                () =>
                    pubsub.asyncIterator([
                        [InventoryCreated],
                        [InventoryUpdated],
                        [InventoryActivated],
                        [InventoryInactivated]
                    ]),
                (payload, variables) => {
                    let { inventoryIds } = variables;
                    if (
                        payload instanceof InventoryUpdated ||
                        payload instanceof InventoryActivated ||
                        payload instanceof InventoryInactivated
                    )
                        return inventoryIds.indexOf(payload._id) > -1;
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                let data = {};
                if (payload instanceof InventoryCreated)
                    data[[InventoryCreated]] = payload;
                else if (payload instanceof InventoryUpdated)
                    data[[InventoryUpdated]] = payload;
                else if (payload instanceof InventoryActivated)
                    data[[InventoryActivated]] = payload;
                else if (payload instanceof InventoryInactivated)
                    data[[InventoryInactivated]] = payload;
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
