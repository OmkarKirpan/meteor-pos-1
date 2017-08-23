import { ORDER, SESSION } from "../../actions/actionTypes";
import reducer, { initialState } from ".";

import expect from "expect";
import update from "react-addons-update";

if (Meteor.isClient) {
    describe("Order reducer", function() {
        it("should return the initial state", function() {
            expect(reducer(undefined, {})).toEqual(initialState);
        });

        it("should handle ORDER.CHANGE_ORDER_PAGE", function() {
            expect(
                reducer(undefined, {
                    type: ORDER.CHANGE_ORDER_PAGE,
                    payload: {
                        current: 10
                    }
                })
            ).toEqual(
                update(initialState, {
                    orderList: { current: { $set: 10 } }
                })
            );
        });

        it("should handle ORDER.SEARCH_ORDERS", function() {
            expect(
                reducer(undefined, {
                    type: ORDER.SEARCH_ORDERS,
                    payload: {
                        filter: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    orderList: { current: { $set: 1 } }
                })
            );
        });

        it("should handle ORDER.ORDER_FORM_OPEN", function() {
            expect(
                reducer(undefined, {
                    type: ORDER.ORDER_FORM_OPEN,
                    payload: {
                        isNew: true,
                        order: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    orderForm: {
                        isNew: { $set: true },
                        editingOrder: {
                            $set: {
                                orderItems: []
                            }
                        },
                        visible: { $set: true },
                        customers: { $set: [] }
                    }
                })
            );
        });

        it("should handle ORDER.ORDER_FORM_CLOSE", function() {
            expect(
                reducer(undefined, {
                    type: ORDER.ORDER_FORM_CLOSE
                })
            ).toEqual(
                update(initialState, {
                    orderForm: {
                        visible: { $set: false },
                        editingOrder: { $set: {} }
                    }
                })
            );
        });

        it("should handle ORDER.REFRESH_ITEMS", function() {
            expect(
                reducer(undefined, {
                    type: ORDER.REFRESH_ITEMS,
                    payload: { items: [] }
                })
            ).toEqual(
                update(initialState, {
                    orderItemForm: {
                        items: { $set: [] }
                    }
                })
            );
        });

        it("should handle ORDER.REFRESH_CUSTOMERS", function() {
            expect(
                reducer(undefined, {
                    type: ORDER.REFRESH_CUSTOMERS,
                    payload: { customers: [] }
                })
            ).toEqual(
                update(initialState, {
                    orderForm: {
                        customers: { $set: [] }
                    }
                })
            );
        });

        it("should handle ORDER.ORDER_FORM_CHANGED", function() {
            expect(
                reducer(undefined, {
                    type: ORDER.ORDER_FORM_CHANGED,
                    payload: {
                        order: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    orderForm: { editingOrder: { $set: {} } }
                })
            );
        });

        it("should handle ORDER.ORDER_ITEM_FORM_OPEN", function() {
            expect(
                reducer(undefined, {
                    type: ORDER.ORDER_ITEM_FORM_OPEN,
                    payload: {
                        isNew: true
                    }
                })
            ).toEqual(
                update(initialState, {
                    orderItemForm: {
                        isNew: { $set: true },
                        visible: { $set: true },
                        editingOrderItem: {
                            $set: { itemPriceCount: 0, discount: 0 }
                        },
                        items: { $set: [] }
                    }
                })
            );
        });

        it("should handle ORDER.ORDER_ITEM_FORM_CLOSE", function() {
            expect(
                reducer(undefined, {
                    type: ORDER.ORDER_ITEM_FORM_CLOSE
                })
            ).toEqual(
                update(initialState, {
                    orderItemForm: {
                        visible: { $set: false },
                        editingOrderItem: { $set: {} }
                    }
                })
            );
        });

        it("should handle ORDER.ORDER_ITEM_FORM_CHANGED", function() {
            expect(
                reducer(undefined, {
                    type: ORDER.ORDER_ITEM_FORM_CHANGED,
                    payload: {
                        orderItem: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    orderItemForm: { editingOrderItem: { $set: {} } }
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
