import { changeUsersPage, searchUsers } from ".";

import ApolloClient from "apollo-client";
import { USER } from "../actionTypes";
import configureMockStore from "redux-mock-store";
import expect from "expect";
import thunk from "redux-thunk";

if (Meteor.isClient) {
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({});

    beforeEach(function() {
        store.clearActions();
    });

    describe("Change user page action", function() {
        it("dispatched action has a type of USER.CHANGE_USER_PAGE", function() {
            const expectedActions = [
                {
                    type: USER.CHANGE_USER_PAGE,
                    payload: { current: 1 }
                }
            ];

            store.dispatch(changeUsersPage({ current: 1 }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Search users action", function() {
        it("dispatched action has a type of USER.SEARCH_USERS", function() {
            const expectedActions = [
                {
                    type: USER.SEARCH_USERS,
                    payload: { filter: {} }
                }
            ];

            store.dispatch(searchUsers({ filter: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
}
