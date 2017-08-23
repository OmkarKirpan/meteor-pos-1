import { ITEM_ADJUSTMENT, SESSION } from "../../actions/actionTypes";
import reducer, { initialState } from ".";

import expect from "expect";
import update from "react-addons-update";

if (Meteor.isClient) {
    describe("ItemAdjustment reducer", function() {
        it("should return the initial state", function() {
            expect(reducer(undefined, {})).toEqual(initialState);
        });

        it("should handle ITEM_ADJUSTMENT.CHANGE_ITEM_ADJUSTMENT_PAGE", function() {
            expect(
                reducer(undefined, {
                    type: ITEM_ADJUSTMENT.CHANGE_ITEM_ADJUSTMENT_PAGE,
                    payload: {
                        current: 10
                    }
                })
            ).toEqual(
                update(initialState, {
                    itemAdjustmentList: { current: { $set: 10 } }
                })
            );
        });

        it("should handle ITEM_ADJUSTMENT.SEARCH_ITEM_ADJUSTMENTS", function() {
            expect(
                reducer(undefined, {
                    type: ITEM_ADJUSTMENT.SEARCH_ITEM_ADJUSTMENTS,
                    payload: {
                        filter: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    itemAdjustmentList: { filter: { $set: {} } }
                })
            );
        });

        it("should handle ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_OPEN", function() {
            expect(
                reducer(undefined, {
                    type: ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_OPEN,
                    payload: {
                        isNew: true,
                        itemAdjustment: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    itemAdjustmentForm: {
                        isNew: { $set: true },
                        editingItemAdjustment: {
                            $set: {
                                adjustmentItemCount: 0,
                                adjustmentItems: []
                            }
                        },
                        visible: { $set: true }
                    }
                })
            );
        });

        it("should handle ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_CLOSE", function() {
            expect(
                reducer(undefined, {
                    type: ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_CLOSE
                })
            ).toEqual(
                update(initialState, {
                    itemAdjustmentForm: {
                        visible: { $set: false },
                        editingItemAdjustment: { $set: {} }
                    }
                })
            );
        });

        it("should handle ITEM_ADJUSTMENT.REFRESH_ITEMS", function() {
            expect(
                reducer(undefined, {
                    type: ITEM_ADJUSTMENT.REFRESH_ITEMS,
                    payload: { items: [] }
                })
            ).toEqual(
                update(initialState, {
                    itemAdjustmentForm: {
                        items: { $set: [] }
                    }
                })
            );
        });

        it("should handle ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_CHANGED", function() {
            expect(
                reducer(undefined, {
                    type: ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_CHANGED,
                    payload: {
                        itemAdjustment: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    itemAdjustmentForm: { editingItemAdjustment: { $set: {} } }
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
