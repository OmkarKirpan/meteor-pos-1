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

    describe("User actions", function() {
        it("changeUsersPage should dispatch an action with type USER.CHANGE_USER_PAGE", function() {
            const expectedActions = [
                {
                    type: USER.CHANGE_USER_PAGE,
                    payload: { current: 1 }
                }
            ];

            store.dispatch(changeUsersPage({ current: 1 }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("searchUsers should dispatch an action with type USER.SEARCH_USERS", function() {
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
