import commands from "../../../domain/Order/commands";

const {
    CreateOrder,
    UpdateOrder,
    CancelOrder,
    FinalizeOrder,
    CompleteOrder
} = commands;

const OrderApi = Space.messaging.Api.extend("OrderApi", {
    dependencies: {
        injector: "Injector",
        log: "log"
    },

    methods() {
        return [
            {
                [CreateOrder]: this._createOrder,
                [UpdateOrder]: this._updateOrder,
                [CancelOrder]: this._cancelOrder,
                [FinalizeOrder]: this._finalizeOrder,
                [CompleteOrder]: this._completeOrder
            }
        ];
    },

    _createOrder(context, command) {
        this.commandBus.send(command);
    },

    _updateOrder(context, command) {
        this.commandBus.send(command);
    },

    _cancelOrder(context, command) {
        this.commandBus.send(command);
    },

    _finalizeOrder(context, command) {
        this.commandBus.send(command);
    },

    _completeOrder(context, command) {
        this.commandBus.send(command);
    }
});

export default OrderApi;
