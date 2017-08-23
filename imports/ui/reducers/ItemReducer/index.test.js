import { ITEM, SESSION } from "../../actions/actionTypes";
import reducer, { initialState } from ".";

import expect from "expect";
import update from "react-addons-update";

if (Meteor.isClient) {
    describe("Item reducer", function() {
        it("should return the initial state", function() {
            expect(reducer(undefined, {})).toEqual(initialState);
        });

        it("should handle ITEM.CHANGE_ITEM_PAGE", function() {
            expect(
                reducer(undefined, {
                    type: ITEM.CHANGE_ITEM_PAGE,
                    payload: {
                        current: 10
                    }
                })
            ).toEqual(
                update(initialState, {
                    itemList: { current: { $set: 10 } }
                })
            );
        });

        it("should handle ITEM.SEARCH_ITEMS", function() {
            expect(
                reducer(undefined, {
                    type: ITEM.SEARCH_ITEMS,
                    payload: {
                        filter: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    itemList: { filter: { $set: {} } }
                })
            );
        });

        it("should handle ITEM.ITEM_FORM_OPEN", function() {
            expect(
                reducer(undefined, {
                    type: ITEM.ITEM_FORM_OPEN,
                    payload: {
                        isNew: true,
                        item: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    itemForm: {
                        isNew: { $set: true },
                        editingItem: { $set: { priceCount: 0 } },
                        visible: { $set: true },
                        categories: { $set: [] },
                        brands: { $set: [] }
                    }
                })
            );
        });

        it("should handle ITEM.ITEM_FORM_CLOSE", function() {
            expect(
                reducer(undefined, {
                    type: ITEM.ITEM_FORM_CLOSE
                })
            ).toEqual(
                update(initialState, {
                    itemForm: {
                        visible: { $set: false },
                        editingItem: { $set: {} }
                    }
                })
            );
        });

        it("should handle ITEM.REFRESH_BRANDS", function() {
            expect(
                reducer(undefined, {
                    type: ITEM.REFRESH_BRANDS,
                    payload: { brands: [] }
                })
            ).toEqual(
                update(initialState, {
                    itemForm: {
                        brands: { $set: [] }
                    }
                })
            );
        });

        it("should handle ITEM.REFRESH_CATEGORIES", function() {
            expect(
                reducer(undefined, {
                    type: ITEM.REFRESH_CATEGORIES,
                    payload: { categories: [] }
                })
            ).toEqual(
                update(initialState, {
                    itemForm: {
                        categories: { $set: [] }
                    }
                })
            );
        });

        it("should handle ITEM.ITEM_FORM_CHANGED", function() {
            expect(
                reducer(undefined, {
                    type: ITEM.ITEM_FORM_CHANGED,
                    payload: {
                        item: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    itemForm: { editingItem: { $set: {} } }
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
