import {
    resolver as categoryResolver,
    typeDefs as categoryTypeDefs
} from "./Category";
import {
    resolver as inventoryResolver,
    typeDefs as inventoryTypeDefs
} from "./Inventory";
import { mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import {
    resolver as supplierResolver,
    typeDefs as supplierTypeDefs
} from "./Supplier";

import { extend } from "lodash";

export const typeDefs = mergeTypes([
    inventoryTypeDefs,
    categoryTypeDefs,
    supplierTypeDefs
]);

export const resolvers = mergeResolvers([
    inventoryResolver,
    categoryResolver,
    supplierResolver
]);
