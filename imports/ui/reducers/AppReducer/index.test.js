import { APP, SESSION } from "../../actions/actionTypes";
import reducer, { initialState } from ".";

import expect from "expect";
import update from "react-addons-update";

if (Meteor.isClient) {
    describe("App reducer", function() {
        it("should return the initial state", function() {
            expect(reducer(undefined, {})).toEqual(initialState);
        });

        it("should handle APP.TOGGLE_SIDEBAR", function() {
            expect(reducer(undefined, { type: APP.TOGGLE_SIDEBAR })).toEqual(
                update(initialState, { sidebarCollapsed: { $set: true } })
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
