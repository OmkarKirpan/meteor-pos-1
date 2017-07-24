import Inventories from "../../../domain/InventoryCategory/repository";
import commands from "../../../domain/InventoryCategory/commands";

const {
    CreateInventoryCategory,
    UpdateInventoryCategory,
    ActivateInventoryCategory,
    InactivateInventoryCategory
} = commands;

const InventoryCategoryApi = Space.messaging.Api.extend(
    "InventoryCategoryApi",
    {
        dependencies: {
            injector: "Injector",
            log: "log"
        },

        methods() {
            return [
                {
                    [CreateInventoryCategory]: this._createInventoryCategory,
                    [UpdateInventoryCategory]: this._updateInventoryCategory,
                    [ActivateInventoryCategory]: this
                        ._activateInventoryCategory,
                    [InactivateInventoryCategory]: this
                        ._inactivateInventoryCategory
                }
            ];
        },

        _createInventoryCategory(context, command) {
            this.commandBus.send(command);
        },

        _updateInventoryCategory(context, command) {
            this.commandBus.send(command);
        },

        _activateInventoryCategory(context, command) {
            this.commandBus.send(command);
        },

        _inactivateInventoryCategory(context, command) {
            this.commandBus.send(command);
        }
    }
);

export default InventoryCategoryApi;
