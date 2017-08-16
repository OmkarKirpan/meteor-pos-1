import Supplier from "../../../domain/Supplier/aggregate";
import commands from "../../../domain/Supplier/commands";

const {
    CreateSupplier,
    UpdateSupplier,
    ActivateSupplier,
    DeactivateSupplier
} = commands;

const SupplierHandler = Space.eventSourcing.Router.extend("SupplierHandler", {
    eventSourceable: Supplier,
    initializingMessage: CreateSupplier,
    routeCommands: [UpdateSupplier, ActivateSupplier, DeactivateSupplier]
});

export default SupplierHandler;
