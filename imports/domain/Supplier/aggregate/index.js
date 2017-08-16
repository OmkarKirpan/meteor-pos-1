import { ENTITYSTATUS } from "../../../constants";
import Suppliers from "../../Category/repository";
import commands from "../commands/";
import events from "../events";

const {
    CreateSupplier,
    UpdateSupplier,
    ActivateSupplier,
    DeactivateSupplier
} = commands;

const {
    SupplierCreated,
    SupplierUpdated,
    SupplierActivated,
    SupplierDeactivated
} = events;

const Supplier = Space.eventSourcing.Aggregate.extend("Supplier", {
    fields: {
        _id: String,
        name: String,
        address: String,
        phoneNumber: String,
        cellphoneNumber: String,
        entityStatus: Number,
        createdAt: Date,
        updatedAt: Date
    },

    commandMap() {
        return {
            [CreateSupplier]: this._createSupplier,
            [UpdateSupplier]: this._updateSupplier,
            [ActivateSupplier]: this._activateSupplier,
            [DeactivateSupplier]: this._deactivateSupplier
        };
    },

    eventMap() {
        return {
            [SupplierCreated]: this._onSupplierCreated,
            [SupplierUpdated]: this._onSupplierUpdated,
            [SupplierActivated]: this._onSupplierActivated,
            [SupplierDeactivated]: this._onSupplierDeactivated
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

    _deactivateSupplier(command) {
        this.record(
            new SupplierDeactivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onSupplierCreated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.ACTIVE;
    },

    _onSupplierUpdated(event) {
        this._assignFields(event);
    },

    _onSupplierActivated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.ACTIVE;
    },

    _onSupplierDeactivated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.INACTIVE;
    }
});

Supplier.registerSnapshotType("SupplierSnapshot");

export default Supplier;
