import Item from "../../../domain/Item/aggregate";
import commands from "../../../domain/Item/commands";

const { CreateItem, UpdateItem, ActivateItem, DeactivateItem } = commands;

const ItemHandler = Space.eventSourcing.Router.extend("ItemHandler", {
    eventSourceable: Item,
    initializingMessage: CreateItem,
    routeCommands: [UpdateItem, ActivateItem, DeactivateItem]
});

export default ItemHandler;
