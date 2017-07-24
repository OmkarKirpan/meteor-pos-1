import { InventoryPrice } from "../valueObjects";
import { RecordStatus } from "../../../constants";
import commands from "../commands/";
import events from "../events";

const {
    CreateInventory,
    UpdateInventory,
    ActivateInventory,
    InactivateInventory
} = commands;

const {
    InventoryCreated,
    InventoryUpdated,
    InventoryActivated,
    InventoryInactivated
} = events;

const Inventory = Space.eventSourcing.Aggregate.extend("Inventory", {
    fields: {
        _id: String,
        name: String,
        stock: Number,
        basePrice: Number,
        baseUnit: String,
        prices: [InventoryPrice],
        status: Number,
        createdAt: Date,
        updatedAt: Date
    },

    commandMap() {
        return {
            [CreateInventory]: this._createInventory,
            [UpdateInventory]: this._updateInventory,
            [ActivateInventory]: this._activateInventory,
            [InactivateInventory]: this._inactivateInventory
        };
    },

    eventMap() {
        return {
            [InventoryCreated]: this._onInventoryCreated,
            [InventoryUpdated]: this._onInventoryUpdated,
            [InventoryActivated]: this._onInventoryActivated,
            [InventoryInactivated]: this._onInventoryInactivated
        };
    },

    // ============= COMMAND HANDLERS =============

    _createInventory(command) {
        this.record(
            new InventoryCreated({
                ...this._eventPropsFromCommand(command),
                createdAt: new Date(),
                updatedAt: new Date()
            })
        );
    },

    _updateInventory(command) {
        this.record(
            new InventoryUpdated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    _activateInventory(command) {
        this.record(
            new InventoryActivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    _inactivateInventory(command) {
        this.record(
            new InventoryInactivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onInventoryCreated(event) {
        this._assignFields(event);
        this.stock = 0;
        this.status = RecordStatus.ACTIVE;
    },

    _onInventoryUpdated(event) {
        this._assignFields(event);
    },

    _onInventoryActivated(event) {
        this._assignFields(event);
        this.status = RecordStatus.ACTIVE;
    },

    _onInventoryInactivated(event) {
        this._assignFields(event);
        this.status = RecordStatus.INACTIVE;
    }
});

Inventory.registerSnapshotType("InventorySnapshot");

export default Inventory;
