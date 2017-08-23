import { SESSION, USER } from "../../actions/actionTypes";
import reducer, { initialState } from ".";

import expect from "expect";
import update from "react-addons-update";

if (Meteor.isClient) {
    describe("User reducer", function() {
        it("should return the initial state", function() {
            expect(reducer(undefined, {})).toEqual(initialState);
        });

        it("should handle USER.CHANGE_USER_PAGE", function() {
            expect(
                reducer(undefined, {
                    type: USER.CHANGE_USER_PAGE,
                    payload: {
                        current: 10
                    }
                })
            ).toEqual(
                update(initialState, {
                    userList: { current: { $set: 10 } }
                })
            );
        });

        it("should handle USER.SEARCH_USERS", function() {
            expect(
                reducer(undefined, {
                    type: USER.SEARCH_USERS,
                    payload: {
                        filter: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    userList: { filter: { $set: {} } }
                })
            );
        });

        it("should handle SESSION.LOGGED_IN", function() {
            expect(reducer(undefined, { type: SESSION.LOGGED_IN })).toEqual(
                initialState
            );
        });

        it("should handle SESSION.LOGGED_OUT", function() {
            expect(reducer(undefined, { type: SESSION.LOGGED_OUT })).toEqual(
                initialState
            );
        });
    });
}
