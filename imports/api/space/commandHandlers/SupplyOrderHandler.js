import SupplyOrder from "../../../domain/SupplyOrder/aggregate";
import commands from "../../../domain/SupplyOrder/commands";

const { CreateSupplyOrder } = commands;

const SupplyOrderHandler = Space.eventSourcing.Router.extend(
    "SupplyOrderHandler",
    {
        eventSourceable: SupplyOrder,
        initializingMessage: CreateSupplyOrder,
        routeCommands: []
    }
);

export default SupplyOrderHandler;
