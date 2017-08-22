import {} from "../../graphql/queries/brand";

import {
    changeBrandForm,
    changeBrandsPage,
    closeBrandForm,
    editBrandForm,
    newBrandForm,
    searchBrands
} from ".";

import ApolloClient from "apollo-client";
import { BRAND } from "../actionTypes";
import { ENTITYSTATUS } from "../../../constants";
import { GETBRAND } from "../../graphql/queries/brand";
import configureMockStore from "redux-mock-store";
import expect from "expect";
import { mockNetworkInterface } from "apollo-test-utils";
import thunk from "redux-thunk";

if (Meteor.isClient) {
    const responseMocks = [
        {
            request: {
                query: GETBRAND,
                variables: { _id: "" }
            },
            result: {
                data: {
                    brand: {
                        _id: "",
                        name: "brand",
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

    describe("Change brand page action", function() {
        it("dispatched action has a type of BRAND.CHANGE_BRAND_PAGE", function() {
            const expectedActions = [
                {
                    type: BRAND.CHANGE_BRAND_PAGE,
                    payload: { current: 1 }
                }
            ];

            store.dispatch(changeBrandsPage({ current: 1 }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Search brands action", function() {
        it("dispatched action has a type of BRAND.SEARCH_BRANDS", function() {
            const expectedActions = [
                {
                    type: BRAND.SEARCH_BRANDS,
                    payload: { filter: {} }
                }
            ];

            store.dispatch(searchBrands({ filter: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("New brand form action", function() {
        it("dispatched action has a BRAND of BRAND.BRAND_FORM_OPEN", function() {
            const expectedActions = [
                {
                    type: BRAND.BRAND_FORM_OPEN,
                    payload: {
                        brand: {},
                        isNew: true
                    }
                }
            ];

            store.dispatch(newBrandForm());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Edit brand form action", function() {
        it("dispatched action has a BRAND of BRAND.BRAND_FORM_OPEN", function() {
            const expectedActions = [
                {
                    type: BRAND.BRAND_FORM_OPEN,
                    payload: {
                        brand: {
                            _id: "",
                            name: "brand",
                            entityStatus: ENTITYSTATUS.ACTIVE
                        },
                        isNew: false
                    }
                }
            ];

            return store
                .dispatch(editBrandForm({ client, _id: "" }))
                .then(function() {
                    expect(store.getActions()).toEqual(expectedActions);
                });
        });
    });

    describe("Close brand form action", function() {
        it("dispatched action has a type of BRAND.BRAND_FORM_CLOSE", function() {
            const expectedActions = [
                {
                    type: BRAND.BRAND_FORM_CLOSE
                }
            ];

            store.dispatch(closeBrandForm());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Change brand form action", function() {
        it("dispatched action has a type of BRAND.BRAND_FORM_CHANGED", function() {
            const expectedActions = [
                {
                    type: BRAND.BRAND_FORM_CHANGED,
                    payload: { brand: {} }
                }
            ];

            store.dispatch(changeBrandForm({ brand: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
}
