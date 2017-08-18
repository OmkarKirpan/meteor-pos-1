import { ENTITYSTATUS } from "../../../constants";
import { ItemAdjustmentItem } from "../valueObjects";
import commands from "../commands/";
import events from "../events";

const { CreateItemAdjustment } = commands;

const { ItemAdjustmentCreated } = events;

const SupplyOrder = Space.eventSourcing.Aggregate.extend("SupplyOrder", {
    fields: {
        _id: String,
        adjustmentDate: Date,
        adjustmentItems: [ItemAdjustmentItem],
        reason: String,
        entityStatus: Number,
        createdAt: Date,
        updatedAt: Date
    },

    commandMap() {
        return {
            [CreateItemAdjustment]: this._createItemAdjustment
        };
    },

    eventMap() {
        return {
            [ItemAdjustmentCreated]: this._onItemAdjustmentCreated
        };
    },

    // ============= COMMAND HANDLERS =============

    _createItemAdjustment(command) {
        this.record(
            new ItemAdjustmentCreated({
                ...this._eventPropsFromCommand(command),
                createdAt: new Date(),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onItemAdjustmentCreated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.ACTIVE;
    }
});

SupplyOrder.registerSnapshotType("SupplyOrderSnapshot");

export default SupplyOrder;
