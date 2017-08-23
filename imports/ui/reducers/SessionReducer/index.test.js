import reducer, { initialState } from ".";

import { SESSION } from "../../actions/actionTypes";
import expect from "expect";
import update from "react-addons-update";

if (Meteor.isClient) {
    describe("Session reducer", function() {
        it("should return the initial state", function() {
            expect(reducer(undefined, {})).toEqual(initialState);
        });

        it("should handle SESSION.OPEN_CHANGE_PASSWORD_FORM", function() {
            expect(
                reducer(undefined, { type: SESSION.OPEN_CHANGE_PASSWORD_FORM })
            ).toEqual(
                update(initialState, {
                    changePasswordForm: { visible: { $set: true } }
                })
            );
        });

        it("should handle SESSION.CLOSE_CHANGE_PASSWORD_FORM", function() {
            expect(
                reducer(undefined, { type: SESSION.CLOSE_CHANGE_PASSWORD_FORM })
            ).toEqual(
                update(initialState, {
                    changePasswordForm: { visible: { $set: false } }
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
