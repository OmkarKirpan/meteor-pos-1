import commands from "../../../domain/Category/commands";

const {
    CreateCategory,
    UpdateCategory,
    ActivateCategory,
    InactivateCategory
} = commands;

const CategoryApi = Space.messaging.Api.extend("CategoryApi", {
    dependencies: {
        injector: "Injector",
        log: "log"
    },

    methods() {
        return [
            {
                [CreateCategory]: this._createCategory,
                [UpdateCategory]: this._updateCategory,
                [ActivateCategory]: this._activateCategory,
                [InactivateCategory]: this._inactivateCategory
            }
        ];
    },

    _createCategory(context, command) {
        this.commandBus.send(command);
    },

    _updateCategory(context, command) {
        this.commandBus.send(command);
    },

    _activateCategory(context, command) {
        this.commandBus.send(command);
    },

    _inactivateCategory(context, command) {
        this.commandBus.send(command);
    }
});

export default CategoryApi;
