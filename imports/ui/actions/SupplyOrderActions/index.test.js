import {} from "../../graphql/queries/supplyOrder";

import {
    changeSupplyOrderForm,
    changeSupplyOrdersPage,
    closeSupplyOrderForm,
    newSupplyOrderForm,
    searchSupplyOrderItems,
    searchSupplyOrderSuppliers,
    searchSupplyOrders
} from ".";

import ApolloClient from "apollo-client";
import { ENTITYSTATUS } from "../../../constants";
import { GETITEMS } from "../../graphql/queries/item";
import { GETSUPPLIERS } from "../../graphql/queries/supplier";
import { SUPPLY_ORDER } from "../actionTypes";
import configureMockStore from "redux-mock-store";
import expect from "expect";
import { mockNetworkInterface } from "apollo-test-utils";
import thunk from "redux-thunk";

if (Meteor.isClient) {
    const responseMocks = [
        {
            request: {
                query: GETSUPPLIERS,
                variables: {
                    pageSize: 10,
                    filter: {},
                    skip: 0
                }
            },
            result: {
                data: {
                    suppliers: [],
                    supplierCount: 0
                }
            }
        },
        {
            request: {
                query: GETITEMS,
                variables: {
                    pageSize: 10,
                    filter: {},
                    skip: 0
                }
            },
            result: {
                data: {
                    items: [],
                    itemCount: 0
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

    describe("Supply order actions", function() {
        it("changeSupplyOrdersPage should dispatch an action with type SUPPLY_ORDER.CHANGE_SUPPLY_ORDER_PAGE", function() {
            const expectedActions = [
                {
                    type: SUPPLY_ORDER.CHANGE_SUPPLY_ORDER_PAGE,
                    payload: { current: 1 }
                }
            ];

            store.dispatch(changeSupplyOrdersPage({ current: 1 }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("searchSupplyOrders should dispatch an action with type SUPPLY_ORDER.SEARCH_SUPPLY_ORDERS", function() {
            const expectedActions = [
                {
                    type: SUPPLY_ORDER.SEARCH_SUPPLY_ORDERS,
                    payload: { filter: {} }
                }
            ];

            store.dispatch(searchSupplyOrders({ filter: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("newSupplyOrderForm should dispatch an action with type SUPPLY_ORDER.SUPPLY_ORDER_FORM_OPEN", function() {
            const expectedActions = [SUPPLY_ORDER.SUPPLY_ORDER_FORM_OPEN];

            store.dispatch(newSupplyOrderForm());

            expect(store.getActions().map(action => action.type)).toEqual(
                expectedActions
            );
        });

        it("closeSupplyOrderForm should dispatch an action with type SUPPLY_ORDER.SUPPLY_ORDER_FORM_CLOSE", function() {
            const expectedActions = [
                {
                    type: SUPPLY_ORDER.SUPPLY_ORDER_FORM_CLOSE
                }
            ];

            store.dispatch(closeSupplyOrderForm());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("changeSupplyOrderForm should dispatch an action with type SUPPLY_ORDER.SUPPLY_ORDER_FORM_CHANGED", function() {
            const expectedActions = [
                {
                    type: SUPPLY_ORDER.SUPPLY_ORDER_FORM_CHANGED,
                    payload: { supplyOrder: {} }
                }
            ];

            store.dispatch(changeSupplyOrderForm({ supplyOrder: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("searchSupplyOrderSuppliers should dispatch an action with type SUPPLY_ORDER.REFRESH_SUPPLIERS", function() {
            const expectedActions = [
                {
                    type: SUPPLY_ORDER.REFRESH_SUPPLIERS,
                    payload: { suppliers: [] }
                }
            ];

            return store
                .dispatch(searchSupplyOrderSuppliers({ client, filter: {} }))
                .then(() =>
                    expect(store.getActions()).toEqual(expectedActions)
                );
        });

        it("searchSupplyOrderItems should dispatch an action with type SUPPLY_ORDER.CHANGE_ORDER_PAGE", function() {
            const expectedActions = [
                {
                    type: SUPPLY_ORDER.REFRESH_ITEMS,
                    payload: { items: [] }
                }
            ];

            return store
                .dispatch(searchSupplyOrderItems({ client, filter: {} }))
                .then(() =>
                    expect(store.getActions()).toEqual(expectedActions)
                );
        });
    });
}
