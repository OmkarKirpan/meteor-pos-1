import { closeChangePasswordForm, openChangePasswordForm } from ".";

import ApolloClient from "apollo-client";
import { SESSION } from "../actionTypes";
import configureMockStore from "redux-mock-store";
import expect from "expect";
import thunk from "redux-thunk";

if (Meteor.isClient) {
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({});

    beforeEach(function() {
        store.clearActions();
    });

    describe("Session actions", function() {
        it("openChangePasswordForm should dispatch an action with type SESSION.OPEN_CHANGE_PASSWORD_FORM", function() {
            const expectedActions = [
                {
                    type: SESSION.OPEN_CHANGE_PASSWORD_FORM
                }
            ];

            store.dispatch(openChangePasswordForm());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("closeChangePasswordForm should dispatch an action with type SESSION.CLOSE_CHANGE_PASSWORD_FORM", function() {
            const expectedActions = [
                {
                    type: SESSION.CLOSE_CHANGE_PASSWORD_FORM
                }
            ];

            store.dispatch(closeChangePasswordForm());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
}
