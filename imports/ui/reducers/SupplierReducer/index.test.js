import { SESSION, SUPPLIER } from "../../actions/actionTypes";
import reducer, { initialState } from ".";

import expect from "expect";
import update from "react-addons-update";

if (Meteor.isClient) {
    describe("Supplier reducer", function() {
        it("should return the initial state", function() {
            expect(reducer(undefined, {})).toEqual(initialState);
        });

        it("should handle SUPPLIER.CHANGE_SUPPLIER_PAGE", function() {
            expect(
                reducer(undefined, {
                    type: SUPPLIER.CHANGE_SUPPLIER_PAGE,
                    payload: {
                        current: 10
                    }
                })
            ).toEqual(
                update(initialState, {
                    supplierList: { current: { $set: 10 } }
                })
            );
        });

        it("should handle SUPPLIER.SEARCH_SUPPLIERS", function() {
            expect(
                reducer(undefined, {
                    type: SUPPLIER.SEARCH_SUPPLIERS,
                    payload: {
                        filter: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    supplierList: { filter: { $set: {} } }
                })
            );
        });

        it("should handle SUPPLIER.SUPPLIER_FORM_OPEN", function() {
            expect(
                reducer(undefined, {
                    type: SUPPLIER.SUPPLIER_FORM_OPEN,
                    payload: {
                        isNew: true,
                        supplier: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    supplierForm: {
                        isNew: { $set: true },
                        editingSupplier: { $set: {} },
                        visible: { $set: true }
                    }
                })
            );
        });

        it("should handle SUPPLIER.SUPPLIER_FORM_CLOSE", function() {
            expect(
                reducer(undefined, {
                    type: SUPPLIER.SUPPLIER_FORM_CLOSE
                })
            ).toEqual(
                update(initialState, {
                    supplierForm: {
                        visible: { $set: false },
                        editingSupplier: { $set: {} }
                    }
                })
            );
        });

        it("should handle SUPPLIER.SUPPLIER_FORM_CHANGED", function() {
            expect(
                reducer(undefined, {
                    type: SUPPLIER.SUPPLIER_FORM_CHANGED,
                    payload: {
                        supplier: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    supplierForm: { editingSupplier: { $set: {} } }
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
