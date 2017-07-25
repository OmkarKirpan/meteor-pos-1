import Category from "../../../domain/Category/aggregate";
import commands from "../../../domain/Category/commands";

const {
    CreateCategory,
    UpdateCategory,
    ActivateCategory,
    InactivateCategory
} = commands;

const CategoryHandler = Space.eventSourcing.Router.extend("CategoryHandler", {
    eventSourceable: Category,
    initializingMessage: CreateCategory,
    routeCommands: [UpdateCategory, ActivateCategory, InactivateCategory]
});

export default CategoryHandler;
