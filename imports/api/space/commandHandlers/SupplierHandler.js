import Supplier from "../../../domain/Supplier/aggregate";
import commands from "../../../domain/Supplier/commands";

const {
    CreateSupplier,
    UpdateSupplier,
    ActivateSupplier,
    InactivateSupplier
} = commands;

const SupplierHandler = Space.eventSourcing.Router.extend("SupplierHandler", {
    eventSourceable: Supplier,
    initializingMessage: CreateSupplier,
    routeCommands: [UpdateSupplier, ActivateSupplier, InactivateSupplier]
});

export default SupplierHandler;
