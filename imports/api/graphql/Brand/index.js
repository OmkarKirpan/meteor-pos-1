import Brands from "../../../domain/Brand/repository";
import { ENTITYSTATUS } from "../../../constants";
import commands from "../../../domain/Brand/commands";
import events from "../../../domain/Brand/events";
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

const { CreateBrand, UpdateBrand } = commands;

const { ItemCreatedBrand, ItemUpdatedBrand } = events;

const queryResolver = {
    Query: {
        brands(_, { filter, skip, pageSize }, context) {
            const { name } = filter || {};
            const queryFilter = {};
            if (name) queryFilter["name"] = { $regex: ".*" + name + ".*" };
            return Brands.find(queryFilter, {
                skip,
                limit: pageSize,
                sort: {
                    createdAt: -1
                }
            }).fetch();
        },
        brandCount(_, { filter }, context) {
            const { name } = filter || {};
            const queryFilter = {};
            if (name) queryFilter["name"] = name;
            return Brands.find(queryFilter).count();
        },
        brand(_, { _id }, context) {
            return Brands.findOne({ _id });
        }
    }
};

const mutationResolver = {
    Mutation: {
        async createBrand(_, { brand }, context) {
            const { name } = brand;
            const _id = uuid.v4();
            const createBrandCommand = new CreateBrand({
                targetId: _id,
                _id,
                name,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            BrandApi.send(createBrandCommand);
            return _id;
        },
        async updateBrand(_, { brand }, context) {
            const { _id, name } = brand;
            const updateBrandCommand = new UpdateBrand({
                targetId: _id,
                _id,
                name,
                updatedAt: new Date()
            });
            BrandApi.send(updateBrandCommand);
            return _id;
        }
    }
};

const subscriptionResolver = {
    Subscription: {
        brandEvent: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([[BrandCreated], [BrandUpdated]]),
                (payload, variables) => {
                    const { brandIds } = variables;
                    if (payload instanceof BrandUpdated)
                        return brandIds.indexOf(payload._id) > -1;
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                const data = {};
                if (payload instanceof BrandCreated)
                    data[[BrandCreated]] = payload;
                else if (payload instanceof BrandUpdated)
                    data[[BrandUpdated]] = payload;
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
