import ItemAdjustment from "../../../domain/ItemAdjustment/aggregate";
import commands from "../../../domain/ItemAdjustment/commands";

const { CreateItemAdjustment } = commands;

const ItemAdjustmentHandler = Space.eventSourcing.Router.extend(
    "ItemAdjustmentHandler",
    {
        eventSourceable: ItemAdjustment,
        initializingMessage: CreateItemAdjustment,
        routeCommands: []
    }
);

export default ItemAdjustmentHandler;
