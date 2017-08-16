import { ENTITYSTATUS } from "../../../constants";
import { ItemPrice } from "../valueObjects";
import commands from "../commands/";
import events from "../events";

const { CreateItem, UpdateItem, ActivateItem, DeactivateItem } = commands;

const { ItemCreated, ItemUpdated, ItemActivated, ItemDeactivated } = events;

const Item = Space.eventSourcing.Aggregate.extend("Item", {
    fields: {
        _id: String,
        brandId: String,
        categoryId: String,
        name: String,
        stock: Number,
        basePrice: Number,
        baseUnit: String,
        itemPrices: [ItemPrice],
        entityStatus: Number,
        createdAt: Date,
        updatedAt: Date
    },

    commandMap() {
        return {
            [CreateItem]: this._createItem,
            [UpdateItem]: this._updateItem,
            [ActivateItem]: this._activateItem,
            [DeactivateItem]: this._deactivateItem
        };
    },

    eventMap() {
        return {
            [ItemCreated]: this._onItemCreated,
            [ItemUpdated]: this._onItemUpdated,
            [ItemActivated]: this._onItemActivated,
            [ItemDeactivated]: this._onItemDeactivated
        };
    },

    // ============= COMMAND HANDLERS =============

    _createItem(command) {
        this.record(
            new ItemCreated({
                ...this._eventPropsFromCommand(command),
                createdAt: new Date(),
                updatedAt: new Date()
            })
        );
    },

    _updateItem(command) {
        this.record(
            new ItemUpdated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    _activateItem(command) {
        this.record(
            new ItemActivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    _deactivateItem(command) {
        this.record(
            new ItemDeactivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onItemCreated(event) {
        this._assignFields(event);
        this.stock = 0;
        this.entityStatus = ENTITYSTATUS.ACTIVE;
    },

    _onItemUpdated(event) {
        this._assignFields(event);
    },

    _onItemActivated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.ACTIVE;
    },

    _onItemDeactivated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.INACTIVE;
    }
});

Item.registerSnapshotType("ItemSnapshot");

export default Item;
