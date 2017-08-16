import Brand from "../../../domain/Brand/aggregate";
import commands from "../../../domain/Brand/commands";

const { CreateBrand, UpdateBrand } = commands;

const BrandHandler = Space.eventSourcing.Router.extend("BrandHandler", {
    eventSourceable: Brand,
    initializingMessage: CreateBrand,
    routeCommands: [UpdateBrand]
});

export default BrandHandler;
