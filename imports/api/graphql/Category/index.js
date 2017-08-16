import Categories from "../../../domain/Category/repository";
import { ENTITYSTATUS } from "../../../constants";
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
    DeactivateCategory
} = commands;

const {
    ItemCreatedCategory,
    ItemUpdatedCategory,
    ItemActivatedCategory,
    ItemDeactivatedCategory
} = events;

const queryResolver = {
    Query: {
        categories(_, { filter, skip, pageSize }, context) {
            const { name } = filter || {};
            const queryFilter = {};
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
            const { name } = filter || {};
            const queryFilter = {};
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
        async createCategory(_, { category }, context) {
            const { name } = category;
            const _id = uuid.v4();
            const createCategoryCommand = new CreateCategory({
                targetId: _id,
                _id,
                name,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            CategoryApi.send(createCategoryCommand);
            return _id;
        },
        async updateCategory(_, { category }, context) {
            const { _id, name } = category;
            const updateCategoryCommand = new UpdateCategory({
                targetId: _id,
                _id,
                name,
                updatedAt: new Date()
            });
            CategoryApi.send(updateCategoryCommand);
            return _id;
        },
        async updateCategoryStatus(_, { _id, newStatus }) {
            const updateStatusCommand =
                newStatus === ENTITYSTATUS.ACTIVE
                    ? new ActivateCategory({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      })
                    : new DeactivateCategory({
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
                        [CategoryDeactivated]
                    ]),
                (payload, variables) => {
                    const { categoryIds } = variables;
                    if (
                        payload instanceof CategoryUpdated ||
                        payload instanceof CategoryActivated ||
                        payload instanceof CategoryDeactivated
                    )
                        return categoryIds.indexOf(payload._id) > -1;
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                const data = {};
                if (payload instanceof CategoryCreated)
                    data[[CategoryCreated]] = payload;
                else if (payload instanceof CategoryUpdated)
                    data[[CategoryUpdated]] = payload;
                else if (payload instanceof CategoryActivated)
                    data[[CategoryActivated]] = payload;
                else if (payload instanceof CategoryDeactivated)
                    data[[CategoryDeactivated]] = payload;
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
