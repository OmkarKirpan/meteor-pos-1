import InventoryCategories from "../../../domain/InventoryCategory/repository";
import { RecordStatus } from "../../../constants";
import commands from "../../../domain/InventoryCategory/commands";
import events from "../../../domain/InventoryCategory/events";
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
    CreateInventoryCategory,
    UpdateInventoryCategory,
    ActivateInventoryCategory,
    InactivateInventoryCategory
} = commands;

const {
    InventoryCreatedCategory,
    InventoryUpdatedCategory,
    InventoryActivatedCategory,
    InventoryInactivatedCategory
} = events;

const queryResolver = {
    Query: {
        inventoryCategories(_, { filter, skip, pageSize }, context) {
            let { name } = filter || {};
            let queryFilter = {};
            if (name) queryFilter["name"] = name;
            return InventoryCategories.find(queryFilter, {
                skip,
                limit: pageSize,
                sort: {
                    createdAt: -1
                }
            }).fetch();
        },
        inventoryCategoryCount(_, { filter }, context) {
            let { name } = filter || {};
            let queryFilter = {};
            if (name) queryFilter["name"] = name;
            return InventoryCategories.find(queryFilter).count();
        },
        inventoryCategory(_, { _id }, context) {
            return InventoryCategories.findOne({ _id });
        }
    }
};

const mutationResolver = {
    Mutation: {
        createInventoryCategory(_, { inventoryCategory }, context) {
            let { name } = inventoryCategory;
            let _id = uuid.v4();
            let createInventoryCategoryCommand = new CreateInventoryCategory({
                targetId: _id,
                _id,
                name,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            InventoryCategoryApi.send(createInventoryCategoryCommand);
            return _id;
        },
        updateInventoryCategory(_, { inventoryCategory }, context) {
            let { _id, name } = inventoryCategory;
            let updateInventoryCategoryCommand = new UpdateInventoryCategory({
                targetId: _id,
                _id,
                name,
                updatedAt: new Date()
            });
            InventoryCategoryApi.send(updateInventoryCategoryCommand);
            return _id;
        },
        updateInventoryStatus(_, { _id, newStatus }) {
            let updateStatusCommand =
                newStatus === RecordStatus.ACTIVE
                    ? new ActivateInventoryCategory({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      })
                    : new InactivateInventoryCategory({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      });
            InventoryCategoryApi.send(updateStatusCommand);
            return _id;
        }
    }
};

const subscriptionResolver = {
    Subscription: {
        inventoryCategoryEvent: {
            subscribe: withFilter(
                () =>
                    pubsub.asyncIterator([
                        [InventoryCategoryCreated],
                        [InventoryCategoryUpdated],
                        [InventoryCategoryActivated],
                        [InventoryCategoryInactivated]
                    ]),
                (payload, variables) => {
                    let { inventoryCategoryIds } = variables;
                    if (
                        payload instanceof InventoryCategoryUpdated ||
                        payload instanceof InventoryCategoryActivated ||
                        payload instanceof InventoryCategoryInactivated
                    )
                        return inventoryCategoryIds.indexOf(payload._id) > -1;
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                let data = {};
                if (payload instanceof InventoryCategoryCreated)
                    data[[InventoryCategoryCreated]] = payload;
                else if (payload instanceof InventoryCategoryUpdated)
                    data[[InventoryCategoryUpdated]] = payload;
                else if (payload instanceof InventoryCategoryActivated)
                    data[[InventoryCategoryActivated]] = payload;
                else if (payload instanceof InventoryCategoryInactivated)
                    data[[InventoryCategoryInactivated]] = payload;
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
