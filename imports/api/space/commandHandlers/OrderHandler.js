import Order from "../../../domain/Order/aggregate";
import commands from "../../../domain/Order/commands";

const {
    CreateOrder,
    UpdateOrder,
    CancelOrder,
    FinalizeOrder,
    CompleteOrder
} = commands;

const OrderHandler = Space.eventSourcing.Router.extend("OrderHandler", {
    eventSourceable: Order,
    initializingMessage: CreateOrder,
    routeCommands: [UpdateOrder, CancelOrder, FinalizeOrder, CompleteOrder]
});

export default OrderHandler;
