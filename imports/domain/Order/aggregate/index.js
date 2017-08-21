import { ENTITYSTATUS, ORDERSTATUS, PAYMENTSTATUS } from "../../../constants";
import { OrderItem, ShipmentInfo } from "../valueObjects";

import commands from "../commands/";
import events from "../events";

const {
    CancelOrder,
    CreateOrder,
    FinalizeOrder,
    CompleteOrder,
    UpdateOrder
} = commands;

const {
    OrderCancelled,
    OrderCreated,
    OrderFinalized,
    OrderCompleted,
    OrderUpdated
} = events;

const Order = Space.eventSourcing.Aggregate.extend("Order", {
    fields: {
        _id: String,
        orderNo: String,
        orderDate: Date,
        customerId: String,
        shipmentInfo: ShipmentInfo,
        orderItems: [OrderItem],
        entityStatus: Number,
        orderStatus: Number,
        paidAmount: Number,
        paymentStatus: Number,
        createdAt: Date,
        updatedAt: Date
    },

    commandMap() {
        return {
            [CreateOrder]: this._createOrder,
            [UpdateOrder]: this._updateOrder,
            [CancelOrder]: this._cancelOrder,
            [FinalizeOrder]: this._finalizeOrder,
            [CompleteOrder]: this._completeOrder
        };
    },

    eventMap() {
        return {
            [OrderCreated]: this._onOrderCreated,
            [OrderUpdated]: this._onOrderUpdated,
            [OrderCancelled]: this._onOrderCancelled,
            [OrderFinalized]: this._onOrderFinalized,
            [OrderCompleted]: this._onOrderCompleted
        };
    },

    // ============= COMMAND HANDLERS =============

    _createOrder(command) {
        this.record(
            new OrderCreated({
                ...this._eventPropsFromCommand(command),
                createdAt: new Date(),
                updatedAt: new Date()
            })
        );
    },

    _updateOrder(command) {
        this.record(
            new OrderUpdated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    _cancelOrder(command) {
        this.record(
            new OrderCancelled({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    _finalizeOrder(command) {
        this.record(
            new OrderFinalized({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    _completeOrder(command) {
        this.record(
            new OrderCompleted({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onOrderCreated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.ACTIVE;
        this.paymentStatus = PAYMENTSTATUS.UNPAID;
        this.orderStatus = ORDERSTATUS.INPROGRESS;
        this.paidAmount = 0;
    },

    _onOrderUpdated(event) {
        this._assignFields(event);
    },

    _onOrderCancelled(event) {
        if (this.paymentStatus === PAYMENTSTATUS.UNPAID) {
            this.orderStatus = ORDERSTATUS.CANCELLED;
        }
    },

    _onOrderFinalized(event) {
        if (this.orderStatus === ORDERSTATUS.INPROGRESS) {
            this.orderStatus = ORDERSTATUS.FINALIZED;
        }
    },

    _onOrderCompleted(event) {
        if (
            this.orderStatus === ORDERSTATUS.FINALIZED ||
            this.orderStatus === ORDERSTATUS.INPROGRESS
        ) {
            this.orderStatus = ORDERSTATUS.COMPLETED;
        }
    }
});

Order.registerSnapshotType("OrderSnapshot");

export default Order;
