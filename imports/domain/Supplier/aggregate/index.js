import { RecordStatus } from "../../../constants";
import Suppliers from "../../Category/repository";
import commands from "../commands/";
import events from "../events";

const { CreateSupplier, UpdateSupplier } = commands;

const { SupplierCreated, SupplierUpdated } = events;

const Supplier = Space.eventSourcing.Aggregate.extend("Supplier", {
    fields: {
        _id: String,
        name: String,
        address: String,
        phoneNumber: Number,
        createdAt: Date,
        updatedAt: Date
    },

    commandMap() {
        return {
            [CreateSupplier]: this._createSupplier,
            [UpdateSupplier]: this._updateSupplier
        };
    },

    eventMap() {
        return {
            [SupplierCreated]: this._onSupplierCreated,
            [SupplierUpdated]: this._onSupplierUpdated
        };
    },

    // ============= COMMAND HANDLERS =============

    _createSupplier(command) {
        this.record(
            new SupplierCreated({
                ...this._eventPropsFromCommand(command),
                createdAt: new Date(),
                updatedAt: new Date()
            })
        );
    },

    _updateSupplier(command) {
        this.record(
            new SupplierUpdated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onSupplierCreated(event) {
        this._assignFields(event);
    },

    _onSupplierUpdated(event) {
        this._assignFields(event);
    }
});

Supplier.registerSnapshotType("SupplierSnapshot");

export default Supplier;
