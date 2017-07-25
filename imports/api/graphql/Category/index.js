import Categories from "../../../domain/Category/repository";
import { RecordStatus } from "../../../constants";
import commands from "../../../domain/Category/commands";
import events from "../../../domain/Category/events";
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
    CreateCategory,
    UpdateCategory,
    ActivateCategory,
    InactivateCategory
} = commands;

const {
    InventoryCreatedCategory,
    InventoryUpdatedCategory,
    InventoryActivatedCategory,
    InventoryInactivatedCategory
} = events;

const queryResolver = {
    Query: {
        categories(_, { filter, skip, pageSize }, context) {
            let { name } = filter || {};
            let queryFilter = {};
            if (name) queryFilter["name"] = { $regex: ".*" + name + ".*" };
            return Categories.find(queryFilter, {
                skip,
                limit: pageSize,
                sort: {
                    createdAt: -1
                }
            }).fetch();
        },
        categoryCount(_, { filter }, context) {
            let { name } = filter || {};
            let queryFilter = {};
            if (name) queryFilter["name"] = name;
            return Categories.find(queryFilter).count();
        },
        category(_, { _id }, context) {
            return Categories.findOne({ _id });
        }
    }
};

const mutationResolver = {
    Mutation: {
        createCategory(_, { category }, context) {
            let { name } = category;
            let _id = uuid.v4();
            let createCategoryCommand = new CreateCategory({
                targetId: _id,
                _id,
                name,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            CategoryApi.send(createCategoryCommand);
            return _id;
        },
        updateCategory(_, { category }, context) {
            let { _id, name } = category;
            let updateCategoryCommand = new UpdateCategory({
                targetId: _id,
                _id,
                name,
                updatedAt: new Date()
            });
            CategoryApi.send(updateCategoryCommand);
            return _id;
        },
        updateCategoryStatus(_, { _id, newStatus }) {
            let updateStatusCommand =
                newStatus === RecordStatus.ACTIVE
                    ? new ActivateCategory({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      })
                    : new InactivateCategory({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      });
            CategoryApi.send(updateStatusCommand);
            return _id;
        }
    }
};

const subscriptionResolver = {
    Subscription: {
        categoryEvent: {
            subscribe: withFilter(
                () =>
                    pubsub.asyncIterator([
                        [CategoryCreated],
                        [CategoryUpdated],
                        [CategoryActivated],
                        [CategoryInactivated]
                    ]),
                (payload, variables) => {
                    let { categoryIds } = variables;
                    if (
                        payload instanceof CategoryUpdated ||
                        payload instanceof CategoryActivated ||
                        payload instanceof CategoryInactivated
                    )
                        return categoryIds.indexOf(payload._id) > -1;
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                let data = {};
                if (payload instanceof CategoryCreated)
                    data[[CategoryCreated]] = payload;
                else if (payload instanceof CategoryUpdated)
                    data[[CategoryUpdated]] = payload;
                else if (payload instanceof CategoryActivated)
                    data[[CategoryActivated]] = payload;
                else if (payload instanceof CategoryInactivated)
                    data[[CategoryInactivated]] = payload;
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
