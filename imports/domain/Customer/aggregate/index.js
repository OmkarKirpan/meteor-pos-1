import Customers from "../../Category/repository";
import { RecordStatus } from "../../../constants";
import commands from "../commands/";
import events from "../events";

const {
    CreateCustomer,
    UpdateCustomer,
    ActivateCustomer,
    InactivateCustomer
} = commands;

const {
    CustomerCreated,
    CustomerUpdated,
    CustomerActivated,
    CustomerInactivated
} = events;

const Customer = Space.eventSourcing.Aggregate.extend("Customer", {
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
            [CreateCustomer]: this._createCustomer,
            [UpdateCustomer]: this._updateCustomer,
            [ActivateCustomer]: this._activateCustomer,
            [InactivateCustomer]: this._inactivateCustomer
        };
    },

    eventMap() {
        return {
            [CustomerCreated]: this._onCustomerCreated,
            [CustomerUpdated]: this._onCustomerUpdated,
            [CustomerActivated]: this._onCustomerActivated,
            [CustomerInactivated]: this._onCustomerInactivated
        };
    },

    // ============= COMMAND HANDLERS =============

    _createCustomer(command) {
        this.record(
            new CustomerCreated({
                ...this._eventPropsFromCommand(command),
                createdAt: new Date(),
                updatedAt: new Date()
            })
        );
    },

    _updateCustomer(command) {
        this.record(
            new CustomerUpdated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    _activateCustomer(command) {
        this.record(
            new CustomerActivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    _inactivateCustomer(command) {
        this.record(
            new CustomerInactivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onCustomerCreated(event) {
        this._assignFields(event);
        this.status = RecordStatus.ACTIVE;
    },

    _onCustomerUpdated(event) {
        this._assignFields(event);
    },

    _onCustomerActivated(event) {
        this._assignFields(event);
        this.status = RecordStatus.ACTIVE;
    },

    _onCustomerInactivated(event) {
        this._assignFields(event);
        this.status = RecordStatus.INACTIVE;
    }
});

Customer.registerSnapshotType("CustomerSnapshot");

export default Customer;
