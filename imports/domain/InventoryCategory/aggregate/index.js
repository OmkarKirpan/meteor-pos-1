import { RecordStatus } from "../../../constants";
import commands from "../commands/";
import events from "../events";

const {
    CreateInventoryCategory,
    UpdateInventoryCategory,
    ActivateInventoryCategory,
    InactivateInventoryCategory
} = commands;

const {
    InventoryCategoryCreated,
    InventoryCategoryUpdated,
    InventoryCategoryActivated,
    InventoryCategoryInactivated
} = events;

const InventoryCategory = Space.eventSourcing.Aggregate.extend(
    "InventoryCategory",
    {
        fields: {
            _id: String,
            name: String,
            status: Number,
            createdAt: Date,
            updatedAt: Date
        },

        commandMap() {
            return {
                [CreateInventoryCategory]: this._createInventoryCategory,
                [UpdateInventoryCategory]: this._updateInventoryCategory,
                [ActivateInventoryCategory]: this._activateInventoryCategory,
                [InactivateInventoryCategory]: this._inactivateInventoryCategory
            };
        },

        eventMap() {
            return {
                [InventoryCreatedCategory]: this._onInventoryCreatedCategory,
                [InventoryUpdatedCategory]: this._onInventoryUpdatedCategory,
                [InventoryActivatedCategory]: this
                    ._onInventoryActivatedCategory,
                [InventoryInactivatedCategory]: this
                    ._onInventoryInactivatedCategory
            };
        },

        // ============= COMMAND HANDLERS =============

        _createInventoryCategory(command) {
            this.record(
                new InventoryCategoryCreated({
                    ...this._eventPropsFromCommand(command),
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            );
        },

        _updateInventoryCategory(command) {
            this.record(
                new InventoryCategoryUpdated({
                    ...this._eventPropsFromCommand(command),
                    updatedAt: new Date()
                })
            );
        },

        _activateInventory(command) {
            this.record(
                new InventoryCategoryActivated({
                    ...this._eventPropsFromCommand(command),
                    updatedAt: new Date()
                })
            );
        },

        _inactivateInventoryCategory(command) {
            this.record(
                new InventoryCategoryInactivated({
                    ...this._eventPropsFromCommand(command),
                    updatedAt: new Date()
                })
            );
        },

        // ============= EVENT HANDLERS ============

        _onInventoryCreatedCategory(event) {
            this._assignFields(event);
            this.status = RecordStatus.ACTIVE;
        },

        _onInventoryUpdatedCategory(event) {
            this._assignFields(event);
        },

        _onInventoryActivatedCategory(event) {
            this._assignFields(event);
            this.status = RecordStatus.ACTIVE;
        },

        _onInventoryInactivatedCategory(event) {
            this._assignFields(event);
            this.status = RecordStatus.INACTIVE;
        }
    }
);

InventoryCategory.registerSnapshotType("InventoryCategorySnapshot");

export default InventoryCategory;
