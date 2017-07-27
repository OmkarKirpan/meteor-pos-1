import commands from "../../../domain/Supplier/commands";

const {
    CreateSupplier,
    UpdateSupplier,
    ActivateSupplier,
    InactivateSupplier
} = commands;

const SupplierApi = Space.messaging.Api.extend("SupplierApi", {
    dependencies: {
        injector: "Injector",
        log: "log"
    },

    methods() {
        return [
            {
                [CreateSupplier]: this._createSupplier,
                [UpdateSupplier]: this._updateSupplier,
                [ActivateSupplier]: this._activateSupplier,
                [InactivateSupplier]: this._inactivateSupplier
            }
        ];
    },

    _createSupplier(context, command) {
        this.commandBus.send(command);
    },

    _updateSupplier(context, command) {
        this.commandBus.send(command);
    },

    _activateSupplier(context, command) {
        this.commandBus.send(command);
    },

    _inactivateSupplier(context, command) {
        this.commandBus.send(command);
    }
});

export default SupplierApi;
