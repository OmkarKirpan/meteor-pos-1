import { ENTITYSTATUS } from "../../../constants";
import Items from "../../../domain/Item/repository";
import { SupplyOrderItem } from "../../../domain/SupplyOrder/valueObjects";
import SupplyOrders from "../../../domain/SupplyOrder/repository";
import commands from "../../../domain/SupplyOrder/commands";
import events from "../../../domain/SupplyOrder/events";
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

const { CreateSupplyOrder } = commands;

const { SupplyOrderCreated } = events;

const queryResolver = {
    Query: {
        supplyOrders(_, { filter, skip, pageSize }, context) {
            const { orderDate } = filter || {};
            const queryFilter = {};
            if (orderDate)
                queryFilter["orderDate"] = {
                    $gte: moment(orderDate)
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .toDate(),
                    $lt: moment(orderDate)
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .add(1, "days")
                        .toDate()
                };
            return SupplyOrders.find(queryFilter, {
                skip,
                limit: pageSize,
                sort: {
                    createdAt: -1
                }
            }).fetch();
        },
        supplyOrderCount(_, { filter }, context) {
            const { orderDate } = filter || {};
            const queryFilter = {};
            if (orderDate)
                queryFilter["orderDate"] = {
                    $gte: moment(orderDate)
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .toDate(),
                    $lt: moment(orderDate)
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .add(1, "days")
                        .toDate()
                };
            return SupplyOrders.find(queryFilter).count();
        },
        supplyOrder(_, { _id }, context) {
            return SupplyOrders.findOne({ _id });
        }
    }
};

const mutationResolver = {
    Mutation: {
        async createSupplyOrder(_, { supplyOrder }, context) {
            const pastSupplyOrderCount = SupplyOrders.find().count() % 10000;
            const orderNo = `SUP-${moment(new Date()).format(
                "YYMMDD"
            )}-${("0000" + pastSupplyOrderCount).slice(-4)}`;

            const {
                supplierId,
                orderDate,
                supplyItems,
                discount
            } = supplyOrder;
            const _id = uuid.v4();
            const supplyItemVOs = (supplyItems || [])
                .map(
                    ({ itemId, price, quantity }) =>
                        new SupplyOrderItem({ itemId, price, quantity })
                );
            const createSupplyOrderCommand = new CreateSupplyOrder({
                targetId: _id,
                _id,
                supplierId,
                orderDate,
                orderNo,
                supplyItems: supplyItemVOs,
                discount,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            SupplyOrderApi.send(createSupplyOrderCommand);
            return _id;
        }
    }
};

const subscriptionResolver = {
    Subscription: {
        supplyOrderEvent: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([[SupplyOrderCreated]]),
                (payload, variables) => {
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                const data = {};
                if (payload instanceof SupplyOrderCreated)
                    data[[SupplyOrderCreated]] = payload;
                return data;
            }
        }
    }
};

const miscResolver = {
    SupplyOrderItem: {
        async item(supplyOrderItem) {
            const { itemId } = supplyOrderItem;
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
