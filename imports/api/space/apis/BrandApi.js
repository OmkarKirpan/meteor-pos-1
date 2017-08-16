import commands from "../../../domain/Brand/commands";

const { CreateBrand, UpdateBrand } = commands;

const BrandApi = Space.messaging.Api.extend("BrandApi", {
    dependencies: {
        injector: "Injector",
        log: "log"
    },

    methods() {
        return [
            {
                [CreateBrand]: this._createBrand,
                [UpdateBrand]: this._updateBrand
            }
        ];
    },

    _createBrand(context, command) {
        this.commandBus.send(command);
    },

    _updateBrand(context, command) {
        this.commandBus.send(command);
    }
});

export default BrandApi;
