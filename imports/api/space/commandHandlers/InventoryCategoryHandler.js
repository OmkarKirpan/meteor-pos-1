import InventoryCategory from "../../../domain/InventoryCategory/aggregate";
import commands from "../../../domain/InventoryCategory/commands";

const {
    CreateInventoryCategory,
    UpdateInventoryCategory,
    ActivateInventoryCategory,
    InactivateInventoryCategory
} = commands;

const InventoryCategoryHandler = Space.eventSourcing.Router.extend(
    "InventoryCategoryHandler",
    {
        eventSourceable: InventoryCategory,
        initializingMessage: CreateInventoryCategory,
        routeCommands: [
            UpdateInventoryCategory,
            ActivateInventoryCategory,
            InactivateInventoryCategory
        ]
    }
);

export default InventoryCategoryHandler;
