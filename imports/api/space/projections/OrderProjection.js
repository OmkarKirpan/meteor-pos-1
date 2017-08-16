import { ENTITYSTATUS, ORDERSTATUS, PAYMENTSTATUS } from "../../../constants";

import events from "../../../domain/Order/events";
import pubsub from "../../graphql/pubsub";

const {
    OrderCreated,
    OrderUpdated,
    OrderCancelled,
    OrderFinalized,
    OrderCompleted
} = events;

const OrderProjection = Space.eventSourcing.Projection.extend(
    "OrderProjection",
    {
        collections: {
            orders: "Orders"
        },

        eventSubscriptions() {
            return [
                {
                    [OrderCreated]: this._onOrderCreated,
                    [OrderUpdated]: this._onOrderUpdated,
                    [OrderCancelled]: this._onOrderCancelled,
                    [OrderFinalized]: this._onOrderFinalized,
                    [OrderCompleted]: this._onOrderCompleted
                }
            ];
        },

        _onOrderCreated(event) {
            event.entityStatus = ENTITYSTATUS.ACTIVE;
            event.paymentStatus = PAYMENTSTATUS.UNPAID;
            event.orderStatus = ORDERSTATUS.INPROGRESS;
            event.paidAmount = 0;
            event.entityStatus = ENTITYSTATUS.ACTIVE;
            const {
                _id,
                orderNo,
                orderDate,
                customerId,
                shipmentInfo,
                orderItems,
                entityStatus,
                orderStatus,
                paidAmount,
                paymentStatus,
                createdAt,
                updatedAt
            } = event;
            this.orders.insert({
                _id,
                orderNo,
                orderDate,
                customerId,
                shipmentInfo: {
                    address: shipmentInfo.address,
                    phoneNumber: shipmentInfo.phoneNumber,
                    cellphoneNumber: shipmentInfo.cellphoneNumber
                },
                orderItems: orderItems.map(orderItem => {
                    return {
                        itemId: orderItem.itemId,
                        itemPrices: orderItem.itemPrices,
                        discount: orderItem.discount
                    };
                }),
                entityStatus,
                orderStatus,
                paidAmount,
                paymentStatus,
                createdAt,
                updatedAt
            });
            pubsub.publish("OrderCreated", event);
        },

        _onOrderUpdated(event) {
            const { _id, shipmentInfo, orderItems, updatedAt } = event;
            const updatedFields = {
                shipmentInfo: {
                    address: shipmentInfo.address,
                    phoneNumber: shipmentInfo.phoneNumber,
                    cellphoneNumber: shipmentInfo.cellphoneNumber
                },
                orderItems: orderItems.map(orderItem => {
                    return {
                        itemId: orderItem.itemId,
                        itemPrices: orderItem.itemPrices,
                        discount: orderItem.discount
                    };
                }),
                updatedAt
            };
            this.orders.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("OrderUpdated", event);
        },

        _onOrderCancelled(event) {
            event.orderStatus = ORDERSTATUS.CANCELLED;
            const { _id, updatedAt, orderStatus } = event;
            const updatedFields = { updatedAt, orderStatus };
            this.orders.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("OrderCancelled", event);
        },

        _onOrderFinalized(event) {
            event.orderStatus = ORDERSTATUS.FINALIZED;
            const { _id, updatedAt, orderStatus } = event;
            const updatedFields = { updatedAt, orderStatus };
            this.orders.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("OrderFinalized", event);
        },

        _onOrderCompleted(event) {
            event.orderStatus = ORDERSTATUS.COMPLETED;
            const { _id, updatedAt, orderStatus } = event;
            const updatedFields = { updatedAt, orderStatus };
            this.orders.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("OrderCompleted", event);
        }
    }
);

export default OrderProjection;
