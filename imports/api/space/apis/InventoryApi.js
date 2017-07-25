import commands from "../../../domain/Inventory/commands";

const {
    CreateInventory,
    UpdateInventory,
    ActivateInventory,
    InactivateInventory
} = commands;

const InventoryApi = Space.messaging.Api.extend("InventoryApi", {
    dependencies: {
        injector: "Injector",
        log: "log"
    },

    methods() {
        return [
            {
                [CreateInventory]: this._createInventory,
                [UpdateInventory]: this._updateInventory,
                [ActivateInventory]: this._activateInventory,
                [InactivateInventory]: this._inactivateInventory
            }
        ];
    },

    _createInventory(context, command) {
        this.commandBus.send(command);
    },

    _updateInventory(context, command) {
        this.commandBus.send(command);
    },

    _activateInventory(context, command) {
        this.commandBus.send(command);
    },

    _inactivateInventory(context, command) {
        this.commandBus.send(command);
    }
});

export default InventoryApi;
