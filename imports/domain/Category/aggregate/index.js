import { ENTITYSTATUS } from "../../../constants";
import commands from "../commands/";
import events from "../events";

const {
    CreateCategory,
    UpdateCategory,
    ActivateCategory,
    DeactivateCategory
} = commands;

const {
    CategoryCreated,
    CategoryUpdated,
    CategoryActivated,
    CategoryDeactivated
} = events;

const Category = Space.eventSourcing.Aggregate.extend("Category", {
    fields: {
        _id: String,
        name: String,
        entityStatus: Number,
        createdAt: Date,
        updatedAt: Date
    },

    commandMap() {
        return {
            [CreateCategory]: this._createCategory,
            [UpdateCategory]: this._updateCategory,
            [ActivateCategory]: this._activateCategory,
            [DeactivateCategory]: this._deactivateCategory
        };
    },

    eventMap() {
        return {
            [CategoryCreated]: this._onCategoryCreated,
            [CategoryUpdated]: this._onCategoryUpdated,
            [CategoryActivated]: this._onCategoryActivated,
            [CategoryDeactivated]: this._onCategoryDeactivated
        };
    },

    // ============= COMMAND HANDLERS =============

    _createCategory(command) {
        this.record(
            new CategoryCreated({
                ...this._eventPropsFromCommand(command),
                createdAt: new Date(),
                updatedAt: new Date()
            })
        );
    },

    _updateCategory(command) {
        this.record(
            new CategoryUpdated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    _activateCategory(command) {
        this.record(
            new CategoryActivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    _deactivateCategory(command) {
        this.record(
            new CategoryDeactivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onCategoryCreated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.ACTIVE;
    },

    _onCategoryUpdated(event) {
        this._assignFields(event);
    },

    _onCategoryActivated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.ACTIVE;
    },

    _onCategoryDeactivated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.INACTIVE;
    }
});

Category.registerSnapshotType("CategorySnapshot");

export default Category;
