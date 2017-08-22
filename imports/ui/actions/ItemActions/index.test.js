import {} from "../../graphql/queries/item";

import {
    changeItemForm,
    changeItemsPage,
    closeItemForm,
    editItemForm,
    newItemForm,
    searchItemBrands,
    searchItemCategories,
    searchItems
} from ".";

import ApolloClient from "apollo-client";
import { ENTITYSTATUS } from "../../../constants";
import { GETBRANDS } from "../../graphql/queries/brand";
import { GETCATEGORIES } from "../../graphql/queries/category";
import { GETITEM } from "../../graphql/queries/item";
import { ITEM } from "../actionTypes";
import configureMockStore from "redux-mock-store";
import expect from "expect";
import { mockNetworkInterface } from "apollo-test-utils";
import thunk from "redux-thunk";

if (Meteor.isClient) {
    const responseMocks = [
        {
            request: {
                query: GETITEM,
                variables: { _id: "" }
            },
            result: {
                data: {
                    item: {
                        _id: "",
                        name: "item",
                        categoryId: "",
                        category: {
                            _id: "",
                            name: ""
                        },
                        brandId: "",
                        brand: {
                            _id: "",
                            name: ""
                        },
                        baseUnit: "",
                        basePrice: 0,
                        stock: 0,
                        itemPrices: [],
                        entityStatus: ENTITYSTATUS.ACTIVE
                    }
                }
            }
        },
        {
            request: {
                query: GETCATEGORIES,
                variables: {
                    pageSize: 10,
                    filter: {},
                    skip: 0
                }
            },
            result: {
                data: {
                    categories: [],
                    categoryCount: 0
                }
            }
        },
        {
            request: {
                query: GETBRANDS,
                variables: {
                    pageSize: 10,
                    filter: {},
                    skip: 0
                }
            },
            result: {
                data: {
                    brands: [],
                    brandCount: 0
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

    describe("Item actions", function() {
        it("changeItemsPage should dispatch an action with type ITEM.CHANGE_ITEM_PAGE", function() {
            const expectedActions = [
                {
                    type: ITEM.CHANGE_ITEM_PAGE,
                    payload: { current: 1 }
                }
            ];

            store.dispatch(changeItemsPage({ current: 1 }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("searchItems should dispatch an action with type ITEM.SEARCH_ITEMS", function() {
            const expectedActions = [
                {
                    type: ITEM.SEARCH_ITEMS,
                    payload: { filter: {} }
                }
            ];

            store.dispatch(searchItems({ filter: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("newItemForm should dispatch an action with type ITEM.ITEM_FORM_OPEN", function() {
            const expectedActions = [
                {
                    type: ITEM.ITEM_FORM_OPEN,
                    payload: {
                        item: {},
                        isNew: true
                    }
                }
            ];

            store.dispatch(newItemForm());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("editItemForm should dispatch an action with type ITEM.ITEM_FORM_OPEN", function() {
            const expectedActions = [
                {
                    type: ITEM.ITEM_FORM_OPEN,
                    payload: {
                        item: {
                            _id: "",
                            name: "item",
                            categoryId: "",
                            category: {
                                _id: "",
                                name: ""
                            },
                            brandId: "",
                            brand: {
                                _id: "",
                                name: ""
                            },
                            baseUnit: "",
                            basePrice: 0,
                            stock: 0,
                            itemPrices: [],
                            entityStatus: ENTITYSTATUS.ACTIVE
                        },
                        isNew: false
                    }
                }
            ];

            return store
                .dispatch(editItemForm({ client, _id: "" }))
                .then(function() {
                    expect(store.getActions()).toEqual(expectedActions);
                });
        });

        it("closeItemForm should dispatch an action with type ITEM.ITEM_FORM_CLOSE", function() {
            const expectedActions = [
                {
                    type: ITEM.ITEM_FORM_CLOSE
                }
            ];

            store.dispatch(closeItemForm());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("changeItemForm should dispatch an action with type ITEM.ITEM_FORM_CHANGED", function() {
            const expectedActions = [
                {
                    type: ITEM.ITEM_FORM_CHANGED,
                    payload: { item: {} }
                }
            ];

            store.dispatch(changeItemForm({ item: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("searchItemBrands should dispatch an action with type ITEM.REFRESH_BRANDS", function() {
            const expectedActions = [
                {
                    type: ITEM.REFRESH_BRANDS,
                    payload: { brands: [] }
                }
            ];

            return store
                .dispatch(searchItemBrands({ client, filter: {} }))
                .then(() =>
                    expect(store.getActions()).toEqual(expectedActions)
                );
        });

        it("searchItemCategories should dispatch an action with type ITEM.REFRESH_CATEGORIES", function() {
            const expectedActions = [
                {
                    type: ITEM.REFRESH_CATEGORIES,
                    payload: { categories: [] }
                }
            ];

            return store
                .dispatch(searchItemCategories({ client, filter: {} }))
                .then(() =>
                    expect(store.getActions()).toEqual(expectedActions)
                );
        });
    });
}
