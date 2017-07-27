import Supplier from "../../../domain/Supplier/aggregate";
import commands from "../../../domain/Supplier/commands";

const { CreateSupplier, UpdateSupplier } = commands;

const SupplierHandler = Space.eventSourcing.Router.extend("SupplierHandler", {
    eventSourceable: Supplier,
    initializingMessage: CreateSupplier,
    routeCommands: [UpdateSupplier]
});

export default SupplierHandler;
