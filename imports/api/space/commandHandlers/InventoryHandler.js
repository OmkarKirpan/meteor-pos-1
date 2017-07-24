import Inventory from "../../../domain/Inventory/aggregate";
import commands from "../../../domain/Inventory/commands";

const {
    CreateInventory,
    UpdateInventory,
    ActivateInventory,
    InactivateInventory
} = commands;

const InventoryHandler = Space.eventSourcing.Router.extend("InventoryHandler", {
    eventSourceable: Inventory,
    initializingMessage: CreateInventory,
    routeCommands: [UpdateInventory, ActivateInventory, InactivateInventory]
});

export default InventoryHandler;
