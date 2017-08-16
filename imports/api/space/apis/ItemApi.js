import commands from "../../../domain/Item/commands";

const { CreateItem, UpdateItem, ActivateItem, DeactivateItem } = commands;

const ItemApi = Space.messaging.Api.extend("ItemApi", {
    dependencies: {
        injector: "Injector",
        log: "log"
    },

    methods() {
        return [
            {
                [CreateItem]: this._createItem,
                [UpdateItem]: this._updateItem,
                [ActivateItem]: this._activateItem,
                [DeactivateItem]: this._deactivateItem
            }
        ];
    },

    _createItem(context, command) {
        this.commandBus.send(command);
    },

    _updateItem(context, command) {
        this.commandBus.send(command);
    },

    _activateItem(context, command) {
        this.commandBus.send(command);
    },

    _deactivateItem(context, command) {
        this.commandBus.send(command);
    }
});

export default ItemApi;
