import { InventoryCategory, InventoryPrice } from "../valueObjects";

import Categories from "../../Category/repository";
import { RecordStatus } from "../../../constants";
import categoryEvents from "../../Category/events";
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

const { CategoryActivated, CategoryInactivated } = categoryEvents;

const Inventory = Space.eventSourcing.Aggregate.extend("Inventory", {
    fields: {
        _id: String,
        categoryId: String,
        category: InventoryCategory,
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
            [InventoryInactivated]: this._onInventoryInactivated,
            [CategoryActivated]: this._onCategoryActivated,
            [CategoryInactivated]: this._onCategoryInactivated
        };
    },

    // ============= COMMAND HANDLERS =============

    _createInventory(command) {
        let { categoryId } = command;
        let categoryData = Categories.findOne({ _id: categoryId });
        let category = new InventoryCategory({
            name: categoryData.name,
            status: categoryData.status
        });
        this.record(
            new InventoryCreated({
                ...this._eventPropsFromCommand(command),
                createdAt: new Date(),
                updatedAt: new Date(),
                category
            })
        );
    },

    _updateInventory(command) {
        let { categoryId } = command;
        let categoryData = Categories.findOne({ _id: categoryId });
        let category = new InventoryCategory({
            name: categoryData.name,
            status: categoryData.status
        });
        this.record(
            new InventoryUpdated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date(),
                category
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
    },

    _onCategoryActivated(event) {
        if (this.categoryId === event._id && this.category) {
            this.category.status = RecordStatus.ACTIVE;
        }
    },

    _onCategoryInactivated(event) {
        if (this.categoryId === event._id && this.category) {
            this.category.status = RecordStatus.INACTIVE;
        }
    }
});

Inventory.registerSnapshotType("InventorySnapshot");

export default Inventory;
