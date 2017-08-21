import { ENTITYSTATUS } from "../../../constants";
import { SupplyOrderItem } from "../valueObjects";
import commands from "../commands/";
import events from "../events";

const { CreateSupplyOrder } = commands;

const { SupplyOrderCreated } = events;

const SupplyOrder = Space.eventSourcing.Aggregate.extend("SupplyOrder", {
    fields: {
        _id: String,
        orderNo: String,
        supplierId: String,
        orderDate: Date,
        supplyItems: [SupplyOrderItem],
        discount: Number,
        entityStatus: Number,
        createdAt: Date,
        updatedAt: Date
    },

    commandMap() {
        return {
            [CreateSupplyOrder]: this._createSupplyOrder
        };
    },

    eventMap() {
        return {
            [SupplyOrderCreated]: this._onSupplyOrderCreated
        };
    },

    // ============= COMMAND HANDLERS =============

    _createSupplyOrder(command) {
        this.record(
            new SupplyOrderCreated({
                ...this._eventPropsFromCommand(command),
                createdAt: new Date(),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onSupplyOrderCreated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.ACTIVE;
    }
});

SupplyOrder.registerSnapshotType("SupplyOrderSnapshot");

export default SupplyOrder;
