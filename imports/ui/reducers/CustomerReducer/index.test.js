import { CUSTOMER, SESSION } from "../../actions/actionTypes";
import reducer, { initialState } from ".";

import expect from "expect";
import update from "react-addons-update";

if (Meteor.isClient) {
    describe("Customer reducer", function() {
        it("should return the initial state", function() {
            expect(reducer(undefined, {})).toEqual(initialState);
        });

        it("should handle CUSTOMER.CHANGE_CUSTOMER_PAGE", function() {
            expect(
                reducer(undefined, {
                    type: CUSTOMER.CHANGE_CUSTOMER_PAGE,
                    payload: {
                        current: 10
                    }
                })
            ).toEqual(
                update(initialState, {
                    customerList: { current: { $set: 10 } }
                })
            );
        });

        it("should handle CUSTOMER.SEARCH_CUSTOMERS", function() {
            expect(
                reducer(undefined, {
                    type: CUSTOMER.SEARCH_CUSTOMERS,
                    payload: {
                        filter: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    customerList: { filter: { $set: {} } }
                })
            );
        });

        it("should handle CUSTOMER.CUSTOMER_FORM_OPEN", function() {
            expect(
                reducer(undefined, {
                    type: CUSTOMER.CUSTOMER_FORM_OPEN,
                    payload: {
                        isNew: true,
                        customer: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    customerForm: {
                        isNew: { $set: true },
                        editingCustomer: { $set: {} },
                        visible: { $set: true }
                    }
                })
            );
        });

        it("should handle CUSTOMER.CUSTOMER_FORM_CLOSE", function() {
            expect(
                reducer(undefined, {
                    type: CUSTOMER.CUSTOMER_FORM_CLOSE
                })
            ).toEqual(
                update(initialState, {
                    customerForm: {
                        visible: { $set: false },
                        editingCustomer: { $set: {} }
                    }
                })
            );
        });

        it("should handle CUSTOMER.CUSTOMER_FORM_CHANGED", function() {
            expect(
                reducer(undefined, {
                    type: CUSTOMER.CUSTOMER_FORM_CHANGED,
                    payload: {
                        customer: {}
                    }
                })
            ).toEqual(
                update(initialState, {
                    customerForm: { editingCustomer: { $set: {} } }
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
