import {
    resolver as categoryResolver,
    typeDefs as categoryTypeDefs
} from "./Category";
import {
    resolver as inventoryResolver,
    typeDefs as inventoryTypeDefs
} from "./Inventory";
import { mergeResolvers, mergeTypes } from "merge-graphql-schemas";

import { extend } from "lodash";

export const typeDefs = mergeTypes([inventoryTypeDefs, categoryTypeDefs]);

export const resolvers = mergeResolvers([inventoryResolver, categoryResolver]);
