import { RecordStatus } from "../../../constants";
import commands from "../commands/";
import events from "../events";

const {
    CreateCategory,
    UpdateCategory,
    ActivateCategory,
    InactivateCategory
} = commands;

const {
    CategoryCreated,
    CategoryUpdated,
    CategoryActivated,
    CategoryInactivated
} = events;

const Category = Space.eventSourcing.Aggregate.extend("Category", {
    fields: {
        _id: String,
        name: String,
        status: Number,
        createdAt: Date,
        updatedAt: Date
    },

    commandMap() {
        return {
            [CreateCategory]: this._createCategory,
            [UpdateCategory]: this._updateCategory,
            [ActivateCategory]: this._activateCategory,
            [InactivateCategory]: this._inactivateCategory
        };
    },

    eventMap() {
        return {
            [CategoryCreated]: this._onCategoryCreated,
            [CategoryUpdated]: this._onCategoryUpdated,
            [CategoryActivated]: this._onCategoryActivated,
            [CategoryInactivated]: this._onCategoryInactivated
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

    _inactivateCategory(command) {
        this.record(
            new CategoryInactivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onCategoryCreated(event) {
        this._assignFields(event);
        this.status = RecordStatus.ACTIVE;
    },

    _onCategoryUpdated(event) {
        this._assignFields(event);
    },

    _onCategoryActivated(event) {
        this._assignFields(event);
        this.status = RecordStatus.ACTIVE;
    },

    _onCategoryInactivated(event) {
        this._assignFields(event);
        this.status = RecordStatus.INACTIVE;
    }
});

Category.registerSnapshotType("CategorySnapshot");

export default Category;
