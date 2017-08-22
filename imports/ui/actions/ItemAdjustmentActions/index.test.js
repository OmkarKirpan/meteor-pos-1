import {} from "../../graphql/queries/itemAdjustment";

import {
    changeItemAdjustmentForm,
    changeItemAdjustmentsPage,
    closeItemAdjustmentForm,
    newItemAdjustmentForm,
    searchItemAdjustmentItems,
    searchItemAdjustments
} from ".";

import ApolloClient from "apollo-client";
import { ENTITYSTATUS } from "../../../constants";
import { GETITEMS } from "../../graphql/queries/item";
import { ITEM_ADJUSTMENT } from "../actionTypes";
import configureMockStore from "redux-mock-store";
import expect from "expect";
import { mockNetworkInterface } from "apollo-test-utils";
import thunk from "redux-thunk";

if (Meteor.isClient) {
    const responseMocks = [
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

    describe("Item adjustment actions", function() {
        it("changeItemAdjustmentsPage should dispatch an action with type ITEM_ADJUSTMENT.CHANGE_ITEM_ADJUSTMENT_PAGE", function() {
            const expectedActions = [
                {
                    type: ITEM_ADJUSTMENT.CHANGE_ITEM_ADJUSTMENT_PAGE,
                    payload: { current: 1 }
                }
            ];

            store.dispatch(changeItemAdjustmentsPage({ current: 1 }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("searchItemAdjustments should dispatch an action with type ITEM_ADJUSTMENT.SEARCH_ITEM_ADJUSTMENTS", function() {
            const expectedActions = [
                {
                    type: ITEM_ADJUSTMENT.SEARCH_ITEM_ADJUSTMENTS,
                    payload: { filter: {} }
                }
            ];

            store.dispatch(searchItemAdjustments({ filter: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("newItemAdjustmentForm should dispatch an action with type ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_OPEN", function() {
            const expectedActions = [ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_OPEN];

            store.dispatch(newItemAdjustmentForm());

            expect(store.getActions().map(action => action.type)).toEqual(
                expectedActions
            );
        });

        it("closeItemAdjustmentForm should dispatch an action with type ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_CLOSE", function() {
            const expectedActions = [
                {
                    type: ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_CLOSE
                }
            ];

            store.dispatch(closeItemAdjustmentForm());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("changeItemAdjustmentForm should dispatch an action with type ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_CHANGED", function() {
            const expectedActions = [
                {
                    type: ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_CHANGED,
                    payload: { itemAdjustment: {} }
                }
            ];

            store.dispatch(changeItemAdjustmentForm({ itemAdjustment: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("searchItemAdjustmentItems should dispatch an action with type ITEM_ADJUSTMENT.REFRESH_ITEMS", function() {
            const expectedActions = [
                {
                    type: ITEM_ADJUSTMENT.REFRESH_ITEMS,
                    payload: { items: [] }
                }
            ];

            return store
                .dispatch(searchItemAdjustmentItems({ client, filter: {} }))
                .then(() =>
                    expect(store.getActions()).toEqual(expectedActions)
                );
        });
    });
}
