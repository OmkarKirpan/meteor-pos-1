import commands from "../../../domain/SupplyOrder/commands";

const { CreateSupplyOrder } = commands;

const SupplyOrderApi = Space.messaging.Api.extend("SupplyOrderApi", {
    dependencies: {
        injector: "Injector",
        log: "log"
    },

    methods() {
        return [
            {
                [CreateSupplyOrder]: this._createSupplyOrder
            }
        ];
    },

    _createSupplyOrder(context, command) {
        this.commandBus.send(command);
    }
});

export default SupplyOrderApi;
