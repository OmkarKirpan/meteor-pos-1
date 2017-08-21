import { OrderItem, ShipmentInfo } from "../../../domain/Order/valueObjects";

import Customers from "../../../domain/Customer/repository";
import { ENTITYSTATUS } from "../../../constants";
import Items from "../../../domain/Item/repository";
import Orders from "../../../domain/Order/repository";
import commands from "../../../domain/Order/commands";
import events from "../../../domain/Order/events";
import { extend } from "lodash";
import inputs from "./inputs";
import { mergeTypes } from "merge-graphql-schemas";
import moment from "moment";
import mutations from "./mutations";
import { orderPrinter } from "../../../util/printing";
import pubsub from "../pubsub";
import queries from "./queries";
import subscriptions from "./subscriptions";
import types from "./types";
import uuid from "uuid";
import { withFilter } from "graphql-subscriptions";

const {
    CreateOrder,
    UpdateOrder,
    CancelOrder,
    FinalizeOrder,
    CompleteOrder
} = commands;

const {
    OrderCreated,
    OrderUpdated,
    OrderCancelled,
    OrderFinalized,
    OrderCompleted
} = events;

const queryResolver = {
    Query: {
        orders(_, { filter, skip, pageSize }, context) {
            const { orderStatus, orderDate } = filter || {};
            const queryFilter = {};
            if (orderStatus !== undefined)
                queryFilter["orderStatus"] = { $eq: orderStatus };
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
            return Orders.find(queryFilter, {
                skip,
                limit: pageSize,
                sort: {
                    createdAt: -1
                }
            }).fetch();
        },
        orderCount(_, { filter }, context) {
            const { orderStatus, orderDate } = filter || {};
            const queryFilter = {};
            if (orderStatus !== undefined)
                queryFilter["orderStatus"] = { $eq: orderStatus };
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
            return Orders.find(queryFilter).count();
        },
        order(_, { _id }, context) {
            return Orders.findOne({ _id });
        }
    }
};

const mutationResolver = {
    Mutation: {
        async createOrder(_, { order }, context) {
            const pastOrderCount = Orders.find().count() % 10000;
            const orderNo = `ORD-${moment(new Date()).format(
                "YYMMDD"
            )}-${("0000" + pastOrderCount).slice(-4)}`;

            const { orderDate, customerId, shipmentInfo, orderItems } = order;
            const _id = uuid.v4();
            const orderItemVOs = (orderItems || [])
                .map(
                    ({ itemId, itemPrices, discount }) =>
                        new OrderItem({ itemId, itemPrices, discount })
                );
            const shipmentInfoVO = new ShipmentInfo(shipmentInfo || {});
            const createOrderCommand = new CreateOrder({
                targetId: _id,
                _id,
                orderNo,
                orderDate,
                customerId,
                shipmentInfo: shipmentInfoVO,
                orderItems: orderItemVOs,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            OrderApi.send(createOrderCommand);
            return _id;
        },
        async updateOrder(_, { order }, context) {
            const { _id, shipmentInfo, orderItems } = order;
            const orderItemVOs = (orderItems || [])
                .map(
                    ({ itemId, itemPrices, discount }) =>
                        new OrderItem({ itemId, itemPrices, discount })
                );
            const shipmentInfoVO = new ShipmentInfo(shipmentInfo || {});
            const updateOrderCommand = new UpdateOrder({
                targetId: _id,
                _id,
                shipmentInfo: shipmentInfoVO,
                orderItems: orderItemVOs,
                updatedAt: new Date()
            });
            OrderApi.send(updateOrderCommand);
            return _id;
        },
        async cancelOrder(_, { _id }, context) {
            const cancelOrderCommand = new CancelOrder({
                targetId: _id,
                _id,
                updatedAt: new Date()
            });
            OrderApi.send(cancelOrderCommand);
            return _id;
        },
        async finalizeOrder(_, { _id }, context) {
            const relatedOrder = Orders.findOne({ _id });
            const orderItemVOs = (relatedOrder.orderItems || [])
                .map(
                    ({ itemId, itemPrices, discount }) =>
                        new OrderItem({ itemId, itemPrices, discount })
                );
            const finalizeOrderCommand = new FinalizeOrder({
                targetId: _id,
                _id,
                orderItems: orderItemVOs,
                updatedAt: new Date()
            });
            OrderApi.send(finalizeOrderCommand);
            return _id;
        },
        async completeOrder(_, { _id }, context) {
            const completeOrderCommand = new CompleteOrder({
                targetId: _id,
                _id,
                updatedAt: new Date()
            });
            OrderApi.send(completeOrderCommand);
            return _id;
        },
        async printOrder(_, { _id }, context) {
            orderPrinter.print(_id);
            return _id;
        }
    }
};

const subscriptionResolver = {
    Subscription: {
        orderEvent: {
            subscribe: withFilter(
                () =>
                    pubsub.asyncIterator([
                        [OrderCreated],
                        [OrderUpdated],
                        [OrderCancelled],
                        [OrderFinalized],
                        [OrderCompleted]
                    ]),
                (payload, variables) => {
                    const { orderIds } = variables;
                    if (payload instanceof OrderUpdated)
                        return orderIds.indexOf(payload._id) > -1;
                    return true;
                }
            ),
            resolve: (payload, args, context, info) => {
                const data = {};
                if (payload instanceof OrderCreated)
                    data[[OrderCreated]] = payload;
                else if (payload instanceof OrderUpdated)
                    data[[OrderUpdated]] = payload;
                else if (payload instanceof OrderCancelled)
                    data[[OrderCancelled]] = payload._id;
                else if (payload instanceof OrderFinalized)
                    data[[OrderFinalized]] = payload._id;
                else if (payload instanceof OrderCompleted)
                    data[[OrderCompleted]] = payload._id;
                return data;
            }
        }
    }
};

const miscResolver = {
    Order: {
        async customer(order) {
            const { customerId } = order;
            return Customers.findOne({ _id: customerId });
        }
    },
    OrderItem: {
        async item(orderItem) {
            const { itemId } = orderItem;
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
