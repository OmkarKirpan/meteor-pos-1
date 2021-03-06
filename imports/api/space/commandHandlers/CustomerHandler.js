import Customer from "../../../domain/Customer/aggregate";
import commands from "../../../domain/Customer/commands";

const {
    CreateCustomer,
    UpdateCustomer,
    ActivateCustomer,
    DeactivateCustomer
} = commands;

const CustomerHandler = Space.eventSourcing.Router.extend("CustomerHandler", {
    eventSourceable: Customer,
    initializingMessage: CreateCustomer,
    routeCommands: [UpdateCustomer, ActivateCustomer, DeactivateCustomer]
});

export default CustomerHandler;
