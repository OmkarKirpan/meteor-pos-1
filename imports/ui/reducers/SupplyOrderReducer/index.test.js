import { SESSION, SUPPLY_ORDER } from "../../actions/actionTypes";
import reducer, { initialState } from ".";

import expect from "expect";
import update from "react-addons-update";

if (Meteor.isClient) {
    describe("SupplyOrder reducer", function() {
        it("should return the initial state", function() {
            expect(reducer(undefined, {})).toEqual(initialState);
        });

        it("should handle SUPPLY_ORDER.CHANGE_SUPPLY_ORDER_PAGE", function() {
            expect(
                reducer(undefined, {
                    type: SUPPLY_ORDER.CHANGE_SUPPLY_ORDER_PAGE,
                    payload: {
                        current: 10
                    }
                })
            ).toEqual(
                update(initialState, {
                    supplyOrderList: { current: { $set: 10 } }
                })
            );
        });

        it("should handle SUPPLY_ORDER.SEARCH_SUPPLY_ORDERS", function() {
            expect(
                reducer(undefined, {
                    type: SUPPLY_ORDER.SEARCH_SUPPLY_ORDERS,
                    payload: {
                        filter: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    supplyOrderList: { filter: { $set: {} } }
                })
            );
        });

        it("should handle SUPPLY_ORDER.SUPPLY_ORDER_FORM_OPEN", function() {
            expect(
                reducer(undefined, {
                    type: SUPPLY_ORDER.SUPPLY_ORDER_FORM_OPEN,
                    payload: {
                        isNew: true,
                        supplyOrder: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    supplyOrderForm: {
                        isNew: { $set: true },
                        editingSupplyOrder: {
                            $set: {
                                supplyItemCount: 0,
                                supplyItems: []
                            }
                        },
                        visible: { $set: true }
                    }
                })
            );
        });

        it("should handle SUPPLY_ORDER.SUPPLY_ORDER_FORM_CLOSE", function() {
            expect(
                reducer(undefined, {
                    type: SUPPLY_ORDER.SUPPLY_ORDER_FORM_CLOSE
                })
            ).toEqual(
                update(initialState, {
                    supplyOrderForm: {
                        visible: { $set: false },
                        editingSupplyOrder: { $set: {} }
                    }
                })
            );
        });

        it("should handle SUPPLY_ORDER.REFRESH_ITEMS", function() {
            expect(
                reducer(undefined, {
                    type: SUPPLY_ORDER.REFRESH_ITEMS,
                    payload: { items: [] }
                })
            ).toEqual(
                update(initialState, {
                    supplyOrderForm: {
                        items: { $set: [] }
                    }
                })
            );
        });

        it("should handle SUPPLY_ORDER.REFRESH_SUPPLIERS", function() {
            expect(
                reducer(undefined, {
                    type: SUPPLY_ORDER.REFRESH_SUPPLIERS,
                    payload: { suppliers: [] }
                })
            ).toEqual(
                update(initialState, {
                    supplyOrderForm: {
                        suppliers: { $set: [] }
                    }
                })
            );
        });

        it("should handle SUPPLY_ORDER.SUPPLY_ORDER_FORM_CHANGED", function() {
            expect(
                reducer(undefined, {
                    type: SUPPLY_ORDER.SUPPLY_ORDER_FORM_CHANGED,
                    payload: {
                        supplyOrder: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    supplyOrderForm: { editingSupplyOrder: { $set: {} } }
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
