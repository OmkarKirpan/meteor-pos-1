import { RecordStatus } from "../../../constants";
import Suppliers from "../../Category/repository";
import commands from "../commands/";
import events from "../events";

const {
    CreateSupplier,
    UpdateSupplier,
    ActivateSupplier,
    InactivateSupplier
} = commands;

const {
    SupplierCreated,
    SupplierUpdated,
    SupplierActivated,
    SupplierInactivated
} = events;

const Supplier = Space.eventSourcing.Aggregate.extend("Supplier", {
    fields: {
        _id: String,
        name: String,
        address: String,
        phoneNumber: String,
        status: Number,
        createdAt: Date,
        updatedAt: Date
    },

    commandMap() {
        return {
            [CreateSupplier]: this._createSupplier,
            [UpdateSupplier]: this._updateSupplier,
            [ActivateSupplier]: this._activateSupplier,
            [InactivateSupplier]: this._inactivateSupplier
        };
    },

    eventMap() {
        return {
            [SupplierCreated]: this._onSupplierCreated,
            [SupplierUpdated]: this._onSupplierUpdated,
            [SupplierActivated]: this._onSupplierActivated,
            [SupplierInactivated]: this._onSupplierInactivated
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

    _activateSupplier(command) {
        this.record(
            new SupplierActivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    _inactivateSupplier(command) {
        this.record(
            new SupplierInactivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onSupplierCreated(event) {
        this._assignFields(event);
        this.status = RecordStatus.ACTIVE;
    },

    _onSupplierUpdated(event) {
        this._assignFields(event);
    },

    _onSupplierActivated(event) {
        this._assignFields(event);
        this.status = RecordStatus.ACTIVE;
    },

    _onSupplierInactivated(event) {
        this._assignFields(event);
        this.status = RecordStatus.INACTIVE;
    }
});

Supplier.registerSnapshotType("SupplierSnapshot");

export default Supplier;
