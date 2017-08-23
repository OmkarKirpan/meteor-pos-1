import { CATEGORY, SESSION } from "../../actions/actionTypes";
import reducer, { initialState } from ".";

import expect from "expect";
import update from "react-addons-update";

if (Meteor.isClient) {
    describe("Category reducer", function() {
        it("should return the initial state", function() {
            expect(reducer(undefined, {})).toEqual(initialState);
        });

        it("should handle CATEGORY.CHANGE_CATEGORY_PAGE", function() {
            expect(
                reducer(undefined, {
                    type: CATEGORY.CHANGE_CATEGORY_PAGE,
                    payload: {
                        current: 10
                    }
                })
            ).toEqual(
                update(initialState, {
                    categoryList: { current: { $set: 10 } }
                })
            );
        });

        it("should handle CATEGORY.SEARCH_CATEGORYS", function() {
            expect(
                reducer(undefined, {
                    type: CATEGORY.SEARCH_CATEGORYS,
                    payload: {
                        filter: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    categoryList: { filter: { $set: {} } }
                })
            );
        });

        it("should handle CATEGORY.CATEGORY_FORM_OPEN", function() {
            expect(
                reducer(undefined, {
                    type: CATEGORY.CATEGORY_FORM_OPEN,
                    payload: {
                        isNew: true,
                        category: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    categoryForm: {
                        isNew: { $set: true },
                        editingCategory: { $set: {} },
                        visible: { $set: true }
                    }
                })
            );
        });

        it("should handle CATEGORY.CATEGORY_FORM_CLOSE", function() {
            expect(
                reducer(undefined, {
                    type: CATEGORY.CATEGORY_FORM_CLOSE
                })
            ).toEqual(
                update(initialState, {
                    categoryForm: {
                        visible: { $set: false },
                        editingCategory: { $set: {} }
                    }
                })
            );
        });

        it("should handle CATEGORY.CATEGORY_FORM_CHANGED", function() {
            expect(
                reducer(undefined, {
                    type: CATEGORY.CATEGORY_FORM_CHANGED,
                    payload: {
                        category: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    categoryForm: { editingCategory: { $set: {} } }
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
