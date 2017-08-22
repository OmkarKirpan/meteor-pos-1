import {} from "../../graphql/queries/supplier";

import {
    changeSupplierForm,
    changeSuppliersPage,
    closeSupplierForm,
    editSupplierForm,
    newSupplierForm,
    searchSuppliers
} from ".";

import ApolloClient from "apollo-client";
import { ENTITYSTATUS } from "../../../constants";
import { GETSUPPLIER } from "../../graphql/queries/supplier";
import { SUPPLIER } from "../actionTypes";
import configureMockStore from "redux-mock-store";
import expect from "expect";
import { mockNetworkInterface } from "apollo-test-utils";
import thunk from "redux-thunk";

if (Meteor.isClient) {
    const responseMocks = [
        {
            request: {
                query: GETSUPPLIER,
                variables: { _id: "" }
            },
            result: {
                data: {
                    supplier: {
                        _id: "",
                        name: "supplier",
                        address: "",
                        phoneNumber: "",
                        cellphoneNumber: "",
                        entityStatus: ENTITYSTATUS.ACTIVE
                    }
                }
            }
        }
    ];
    const client = new ApolloClient({
        networkInterface: mockNetworkInterface(...responseMocks),
        addTypename: false
    });
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({});

    beforeEach(function() {
        store.clearActions();
    });

    describe("Change supplier page action", function() {
        it("dispatched action has a type of SUPPLIER.CHANGE_SUPPLIER_PAGE", function() {
            const expectedActions = [
                {
                    type: SUPPLIER.CHANGE_SUPPLIER_PAGE,
                    payload: { current: 1 }
                }
            ];

            store.dispatch(changeSuppliersPage({ current: 1 }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Search suppliers action", function() {
        it("dispatched action has a type of SUPPLIER.SEARCH_SUPPLIERS", function() {
            const expectedActions = [
                {
                    type: SUPPLIER.SEARCH_SUPPLIERS,
                    payload: { filter: {} }
                }
            ];

            store.dispatch(searchSuppliers({ filter: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("New supplier form action", function() {
        it("dispatched action has a SUPPLIER of SUPPLIER.SUPPLIER_FORM_OPEN", function() {
            const expectedActions = [
                {
                    type: SUPPLIER.SUPPLIER_FORM_OPEN,
                    payload: {
                        supplier: {},
                        isNew: true
                    }
                }
            ];

            store.dispatch(newSupplierForm());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Edit supplier form action", function() {
        it("dispatched action has a SUPPLIER of SUPPLIER.SUPPLIER_FORM_OPEN", function() {
            const expectedActions = [
                {
                    type: SUPPLIER.SUPPLIER_FORM_OPEN,
                    payload: {
                        supplier: {
                            _id: "",
                            name: "supplier",
                            address: "",
                            phoneNumber: "",
                            cellphoneNumber: "",
                            entityStatus: ENTITYSTATUS.ACTIVE
                        },
                        isNew: false
                    }
                }
            ];

            return store
                .dispatch(editSupplierForm({ client, _id: "" }))
                .then(function() {
                    expect(store.getActions()).toEqual(expectedActions);
                });
        });
    });

    describe("Close supplier form action", function() {
        it("dispatched action has a type of SUPPLIER.SUPPLIER_FORM_CLOSE", function() {
            const expectedActions = [
                {
                    type: SUPPLIER.SUPPLIER_FORM_CLOSE
                }
            ];

            store.dispatch(closeSupplierForm());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    describe("Change supplier form action", function() {
        it("dispatched action has a type of SUPPLIER.SUPPLIER_FORM_CHANGED", function() {
            const expectedActions = [
                {
                    type: SUPPLIER.SUPPLIER_FORM_CHANGED,
                    payload: { supplier: {} }
                }
            ];

            store.dispatch(changeSupplierForm({ supplier: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
}
