import { extend } from "lodash";
import inputs from "./inputs";
import { mergeTypes } from "merge-graphql-schemas";
import mutations from "./mutations";
import queries from "./queries";
import types from "./types";

const queryResolver = {
    Query: {
        users(_, { filter, skip, pageSize }, context) {
            const { username } = filter || {};
            const queryFilter = {};
            if (username)
                queryFilter["username"] = { $regex: ".*" + username + ".*" };
            return Meteor.users.find(queryFilter).fetch();
        },
        userCount(_, { filter }, context) {
            const { username } = filter || {};
            const queryFilter = {};
            if (username)
                queryFilter["username"] = { $regex: ".*" + username + ".*" };
            return Meteor.users.find(queryFilter).count();
        }
    }
};

const mutationResolver = {
    Mutation: {
        async createUser(_, { user }, context) {
            const { username, password } = user;
            return Accounts.createUser({ username, password });
        },
        async changePassword(_, { newPassword }, context) {
            const { userId } = context;
            Accounts.setPassword(userId, newPassword, { logout: false });
            return userId;
        }
    }
};

export const typeDefs = mergeTypes([types, inputs, queries, mutations]);

export const resolver = extend({}, queryResolver, mutationResolver);
