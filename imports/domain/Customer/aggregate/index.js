import Customers from "../../Category/repository";
import { ENTITYSTATUS } from "../../../constants";
import commands from "../commands/";
import events from "../events";

const {
    CreateCustomer,
    UpdateCustomer,
    ActivateCustomer,
    DeactivateCustomer
} = commands;

const {
    CustomerCreated,
    CustomerUpdated,
    CustomerActivated,
    CustomerDeactivated
} = events;

const Customer = Space.eventSourcing.Aggregate.extend("Customer", {
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
            [CreateCustomer]: this._createCustomer,
            [UpdateCustomer]: this._updateCustomer,
            [ActivateCustomer]: this._activateCustomer,
            [DeactivateCustomer]: this._deactivateCustomer
        };
    },

    eventMap() {
        return {
            [CustomerCreated]: this._onCustomerCreated,
            [CustomerUpdated]: this._onCustomerUpdated,
            [CustomerActivated]: this._onCustomerActivated,
            [CustomerDeactivated]: this._onCustomerDeactivated
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

    _deactivateCustomer(command) {
        this.record(
            new CustomerDeactivated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onCustomerCreated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.ACTIVE;
    },

    _onCustomerUpdated(event) {
        this._assignFields(event);
    },

    _onCustomerActivated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.ACTIVE;
    },

    _onCustomerDeactivated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.INACTIVE;
    }
});

Customer.registerSnapshotType("CustomerSnapshot");

export default Customer;
