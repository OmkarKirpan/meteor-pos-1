import commands from "../../../domain/Supplier/commands";

const {
    CreateSupplier,
    UpdateSupplier,
    ActivateSupplier,
    DeactivateSupplier
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
                [DeactivateSupplier]: this._deactivateSupplier
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

    _deactivateSupplier(context, command) {
        this.commandBus.send(command);
    }
});

export default SupplierApi;
