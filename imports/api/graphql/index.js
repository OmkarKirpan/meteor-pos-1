import { resolver as brandResolver, typeDefs as brandTypeDefs } from "./Brand";
import {
    resolver as categoryResolver,
    typeDefs as categoryTypeDefs
} from "./Category";
import {
    resolver as customerResolver,
    typeDefs as customerTypeDefs
} from "./Customer";
import { resolver as itemResolver, typeDefs as itemTypeDefs } from "./Item";
import { mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import { resolver as orderResolver, typeDefs as orderTypeDefs } from "./Order";
import {
    resolver as supplierResolver,
    typeDefs as supplierTypeDefs
} from "./Supplier";

import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import { extend } from "lodash";

const scalarTypeDefs = `
    scalar Date
`;

const scalarTypeResolver = {
    Date: new GraphQLScalarType({
        name: "Date",
        description: "Date custom scalar type",
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(parseInt(ast.value, 10)); // ast value is always in string format
            }
            return null;
        }
    })
};

export const typeDefs = mergeTypes([
    itemTypeDefs,
    categoryTypeDefs,
    supplierTypeDefs,
    customerTypeDefs,
    brandTypeDefs,
    orderTypeDefs,
    scalarTypeDefs
]);

export const resolvers = mergeResolvers([
    itemResolver,
    categoryResolver,
    supplierResolver,
    customerResolver,
    brandResolver,
    orderResolver,
    scalarTypeResolver
]);
