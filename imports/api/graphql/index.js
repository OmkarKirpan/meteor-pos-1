import {
    resolver as inventoryCategoryResolver,
    typeDefs as inventoryCategoryTypeDefs
} from "./InventoryCategory";
import {
    resolver as inventoryResolver,
    typeDefs as inventoryTypeDefs
} from "./Inventory";
import { mergeResolvers, mergeTypes } from "merge-graphql-schemas";

import { extend } from "lodash";

export const typeDefs = mergeTypes([
    inventoryTypeDefs,
    inventoryCategoryTypeDefs
]);

export const resolvers = mergeResolvers([
    inventoryResolver,
    inventoryCategoryResolver
]);
