import commands from "../../../domain/ItemAdjustment/commands";

const { CreateItemAdjustment } = commands;

const ItemAdjustmentApi = Space.messaging.Api.extend("ItemAdjustmentApi", {
    dependencies: {
        injector: "Injector",
        log: "log"
    },

    methods() {
        return [
            {
                [CreateItemAdjustment]: this._createItemAdjustment
            }
        ];
    },

    _createItemAdjustment(context, command) {
        this.commandBus.send(command);
    }
});

export default ItemAdjustmentApi;
