import {} from "../../graphql/queries/customer";

import {
    changeCustomerForm,
    changeCustomersPage,
    closeCustomerForm,
    editCustomerForm,
    newCustomerForm,
    searchCustomers
} from ".";

import ApolloClient from "apollo-client";
import { CUSTOMER } from "../actionTypes";
import { ENTITYSTATUS } from "../../../constants";
import { GETCUSTOMER } from "../../graphql/queries/customer";
import configureMockStore from "redux-mock-store";
import expect from "expect";
import { mockNetworkInterface } from "apollo-test-utils";
import thunk from "redux-thunk";

if (Meteor.isClient) {
    const responseMocks = [
        {
            request: {
                query: GETCUSTOMER,
                variables: { _id: "" }
            },
            result: {
                data: {
                    customer: {
                        _id: "",
                        name: "customer",
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

    describe("Change customer page action", function() {
        it("dispatched action has a type of CUSTOMER.CHANGE_CUSTOMER_PAGE", function() {
            const expectedActions = [
                {
                    type: CUSTOMER.CHANGE_CUSTOMER_PAGE,
                    payload: { current: 1 }
                }
            ];

            store.dispatch(changeCustomersPage({ current: 1 }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Search customers action", function() {
        it("dispatched action has a type of CUSTOMER.SEARCH_CUSTOMERS", function() {
            const expectedActions = [
                {
                    type: CUSTOMER.SEARCH_CUSTOMERS,
                    payload: { filter: {} }
                }
            ];

            store.dispatch(searchCustomers({ filter: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("New customer form action", function() {
        it("dispatched action has a CUSTOMER of CUSTOMER.CUSTOMER_FORM_OPEN", function() {
            const expectedActions = [
                {
                    type: CUSTOMER.CUSTOMER_FORM_OPEN,
                    payload: {
                        customer: {},
                        isNew: true
                    }
                }
            ];

            store.dispatch(newCustomerForm());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Edit customer form action", function() {
        it("dispatched action has a CUSTOMER of CUSTOMER.CUSTOMER_FORM_OPEN", function() {
            const expectedActions = [
                {
                    type: CUSTOMER.CUSTOMER_FORM_OPEN,
                    payload: {
                        customer: {
                            _id: "",
                            name: "customer",
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
                .dispatch(editCustomerForm({ client, _id: "" }))
                .then(function() {
                    expect(store.getActions()).toEqual(expectedActions);
                });
        });
    });

    describe("Close customer form action", function() {
        it("dispatched action has a type of CUSTOMER.CUSTOMER_FORM_CLOSE", function() {
            const expectedActions = [
                {
                    type: CUSTOMER.CUSTOMER_FORM_CLOSE
                }
            ];

            store.dispatch(closeCustomerForm());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Change customer form action", function() {
        it("dispatched action has a type of CUSTOMER.CUSTOMER_FORM_CHANGED", function() {
            const expectedActions = [
                {
                    type: CUSTOMER.CUSTOMER_FORM_CHANGED,
                    payload: { customer: {} }
                }
            ];

            store.dispatch(changeCustomerForm({ customer: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
}
