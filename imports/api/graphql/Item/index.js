import Brands from "../../../domain/Brand/repository";
import Categories from "../../../domain/Category/repository";
import { ENTITYSTATUS } from "../../../constants";
import { ItemPrice } from "../../../domain/Item/valueObjects";
import Items from "../../../domain/Item/repository";
import commands from "../../../domain/Item/commands";
import events from "../../../domain/Item/events";
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

const { CreateItem, UpdateItem, ActivateItem, DeactivateItem } = commands;

const { ItemCreated, ItemUpdated, ItemActivated, ItemDeactivated } = events;

const queryResolver = {
    Query: {
        items(_, { filter, skip, pageSize }, context) {
            const { name, entityStatus } = filter || {};
            const queryFilter = {};
            if (name) queryFilter["name"] = { $regex: ".*" + name + ".*" };
            if (entityStatus !== undefined)
                queryFilter["entityStatus"] = { $eq: entityStatus };
            return Items.find(queryFilter, {
                skip,
                limit: pageSize,
                sort: {
                    createdAt: -1
                }
            }).fetch();
        },
        itemCount(_, { filter }, context) {
            const { name, entityStatus } = filter || {};
            const queryFilter = {};
            if (name) queryFilter["name"] = { $regex: ".*" + name + ".*" };
            if (entityStatus !== undefined)
                queryFilter["entityStatus"] = { $eq: entityStatus };
            return Items.find(queryFilter).count();
        },
        item(_, { _id }, context) {
            return Items.findOne({ _id });
        }
    }
};

const mutationResolver = {
    Mutation: {
        async createItem(_, { item }, context) {
            const {
                name,
                basePrice,
                baseUnit,
                itemPrices,
                categoryId,
                brandId
            } = item;
            const _id = uuid.v4();
            const itemPriceVOs = (itemPrices || [])
                .map(
                    ({ unit, price, multiplier }) =>
                        new ItemPrice({ unit, price, multiplier })
                );
            const createItemCommand = new CreateItem({
                targetId: _id,
                _id,
                categoryId,
                brandId,
                name,
                basePrice,
                baseUnit,
                itemPrices: itemPriceVOs,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            ItemApi.send(createItemCommand);
            return _id;
        },
        async updateItem(_, { item }, context) {
            const {
                _id,
                categoryId,
                brandId,
                name,
                basePrice,
                baseUnit,
                itemPrices
            } = item;
            const itemPriceVOs = (itemPrices || [])
                .map(
                    ({ unit, price, multiplier }) =>
                        new ItemPrice({ unit, price, multiplier })
                );
            const updateItemCommand = new UpdateItem({
                targetId: _id,
                _id,
                categoryId,
                brandId,
                name,
                basePrice,
                baseUnit,
                itemPrices: itemPriceVOs,
                updatedAt: new Date()
            });
            ItemApi.send(updateItemCommand);
            return _id;
        },
        async updateItemStatus(_, { _id, newStatus }) {
            const updateStatusCommand =
                newStatus === ENTITYSTATUS.ACTIVE
                    ? new ActivateItem({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      })
                    : new DeactivateItem({
                          targetId: _id,
                          _id,
                          updatedAt: new Date()
                      });
            ItemApi.send(updateStatusCommand);
            return _id;
        }
    }
};

const subscriptionResolver = {
    Subscription: {
        itemEvent: {
            subscribe: withFilter(
                () =>
                    pubsub.asyncIterator([
                        [ItemCreated],
                        [ItemUpdated],
                        [ItemActivated],
                        [ItemDeactivated]
                    ]),
                (payload, variables) => {
                    const { itemIds } = variables;
                    if (
                        payload instanceof ItemUpdated ||
                        payload instanceof ItemActivated ||
                        payload instanceof ItemDeactivated
                    )
                        return itemIds.indexOf(payload._id) > -1;
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                const data = {};
                if (payload instanceof ItemCreated)
                    data[[ItemCreated]] = payload;
                else if (payload instanceof ItemUpdated)
                    data[[ItemUpdated]] = payload;
                else if (payload instanceof ItemActivated)
                    data[[ItemActivated]] = payload;
                else if (payload instanceof ItemDeactivated)
                    data[[ItemDeactivated]] = payload;
                return data;
            }
        }
    }
};

const miscResolver = {
    Item: {
        async brand(item) {
            const { brandId } = item;
            return Brands.findOne({ _id: brandId });
        },
        async category(item) {
            const { categoryId } = item;
            return Categories.findOne({ _id: categoryId });
        },
        async allPrices(item) {
            const { baseUnit, basePrice, itemPrices } = item;
            let allPrices = [
                { unit: baseUnit, price: basePrice, multiplier: 1 }
            ];
            allPrices = allPrices.concat(itemPrices);
            allPrices.sort(
                (itemPrice1, itemPrice2) =>
                    itemPrice2.multiplier - itemPrice1.multiplier
            );
            return allPrices;
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
    subscriptionResolver,
    miscResolver
);
