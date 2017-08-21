import { ENTITYSTATUS } from "../../../constants";
import { ItemAdjustmentItem } from "../../../domain/ItemAdjustment/valueObjects";
import ItemAdjustments from "../../../domain/ItemAdjustment/repository";
import Items from "../../../domain/Item/repository";
import commands from "../../../domain/ItemAdjustment/commands";
import events from "../../../domain/ItemAdjustment/events";
import { extend } from "lodash";
import inputs from "./inputs";
import { mergeTypes } from "merge-graphql-schemas";
import moment from "moment";
import mutations from "./mutations";
import pubsub from "../pubsub";
import queries from "./queries";
import subscriptions from "./subscriptions";
import types from "./types";
import uuid from "uuid";
import { withFilter } from "graphql-subscriptions";

const { CreateItemAdjustment } = commands;

const { ItemAdjustmentCreated } = events;

const queryResolver = {
    Query: {
        itemAdjustments(_, { filter, skip, pageSize }, context) {
            const { adjustmentDate } = filter || {};
            const queryFilter = {};
            if (adjustmentDate)
                queryFilter["adjustmentDate"] = {
                    $gte: moment(adjustmentDate)
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .toDate(),
                    $lt: moment(adjustmentDate)
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .add(1, "days")
                        .toDate()
                };
            return ItemAdjustments.find(queryFilter, {
                skip,
                limit: pageSize,
                sort: {
                    createdAt: -1
                }
            }).fetch();
        },
        itemAdjustmentCount(_, { filter }, context) {
            const { adjustmentDate } = filter || {};
            const queryFilter = {};
            if (adjustmentDate)
                queryFilter["adjustmentDate"] = {
                    $gte: moment(adjustmentDate)
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .toDate(),
                    $lt: moment(adjustmentDate)
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .add(1, "days")
                        .toDate()
                };
            return ItemAdjustments.find(queryFilter).count();
        },
        itemAdjustment(_, { _id }, context) {
            return ItemAdjustments.findOne({ _id });
        }
    }
};

const mutationResolver = {
    Mutation: {
        async createItemAdjustment(_, { itemAdjustment }, context) {
            const pastAdjustmentCount = ItemAdjustments.find().count() % 10000;
            const adjustmentNo = `ADJ-${moment(new Date()).format(
                "YYMMDD"
            )}-${("0000" + pastAdjustmentCount).slice(-4)}`;

            const { adjustmentDate, adjustmentItems, reason } = itemAdjustment;
            const _id = uuid.v4();
            const adjustmentItemVOs = (adjustmentItems || [])
                .map(
                    ({ itemId, quantity }) =>
                        new ItemAdjustmentItem({ itemId, quantity })
                );
            const createItemAdjustmentCommand = new CreateItemAdjustment({
                targetId: _id,
                _id,
                adjustmentNo,
                adjustmentDate,
                adjustmentItems: adjustmentItemVOs,
                reason,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            ItemAdjustmentApi.send(createItemAdjustmentCommand);
            return _id;
        }
    }
};

const subscriptionResolver = {
    Subscription: {
        itemAdjustmentEvent: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([[ItemAdjustmentCreated]]),
                (payload, variables) => {
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                const data = {};
                if (payload instanceof ItemAdjustmentCreated)
                    data[[ItemAdjustmentCreated]] = payload;
                return data;
            }
        }
    }
};

const miscResolver = {
    ItemAdjustmentItem: {
        async item(itemAdjustmentItem) {
            const { itemId } = itemAdjustmentItem;
            return Items.findOne({ _id: itemId });
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
