import { BRAND, SESSION } from "../../actions/actionTypes";
import reducer, { initialState } from ".";

import expect from "expect";
import update from "react-addons-update";

if (Meteor.isClient) {
    describe("Brand reducer", function() {
        it("should return the initial state", function() {
            expect(reducer(undefined, {})).toEqual(initialState);
        });

        it("should handle BRAND.CHANGE_BRAND_PAGE", function() {
            expect(
                reducer(undefined, {
                    type: BRAND.CHANGE_BRAND_PAGE,
                    payload: {
                        current: 10
                    }
                })
            ).toEqual(
                update(initialState, {
                    brandList: { current: { $set: 10 } }
                })
            );
        });

        it("should handle BRAND.SEARCH_BRANDS", function() {
            expect(
                reducer(undefined, {
                    type: BRAND.SEARCH_BRANDS,
                    payload: {
                        filter: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    brandList: { filter: { $set: {} } }
                })
            );
        });

        it("should handle BRAND.BRAND_FORM_OPEN", function() {
            expect(
                reducer(undefined, {
                    type: BRAND.BRAND_FORM_OPEN,
                    payload: {
                        isNew: true,
                        brand: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    brandForm: {
                        isNew: { $set: true },
                        editingBrand: { $set: {} },
                        visible: { $set: true }
                    }
                })
            );
        });

        it("should handle BRAND.BRAND_FORM_CLOSE", function() {
            expect(
                reducer(undefined, {
                    type: BRAND.BRAND_FORM_CLOSE
                })
            ).toEqual(
                update(initialState, {
                    brandForm: {
                        visible: { $set: false },
                        editingBrand: { $set: {} }
                    }
                })
            );
        });

        it("should handle BRAND.BRAND_FORM_CHANGED", function() {
            expect(
                reducer(undefined, {
                    type: BRAND.BRAND_FORM_CHANGED,
                    payload: {
                        brand: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    brandForm: { editingBrand: { $set: {} } }
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
