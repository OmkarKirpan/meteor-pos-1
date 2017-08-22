import {} from "../../graphql/queries/category";

import {
    changeCategoriesPage,
    changeCategoryForm,
    closeCategoryForm,
    editCategoryForm,
    newCategoryForm,
    searchCategories
} from ".";

import ApolloClient from "apollo-client";
import { CATEGORY } from "../actionTypes";
import { ENTITYSTATUS } from "../../../constants";
import { GETCATEGORY } from "../../graphql/queries/category";
import configureMockStore from "redux-mock-store";
import expect from "expect";
import { mockNetworkInterface } from "apollo-test-utils";
import thunk from "redux-thunk";

if (Meteor.isClient) {
    const responseMocks = [
        {
            request: {
                query: GETCATEGORY,
                variables: { _id: "" }
            },
            result: {
                data: {
                    category: {
                        _id: "",
                        name: "category",
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

    describe("Category actions", function() {
        it("changeCategoriesPage should dispatch an action with type CATEGORY.CHANGE_CATEGORY_PAGE", function() {
            const expectedActions = [
                {
                    type: CATEGORY.CHANGE_CATEGORY_PAGE,
                    payload: { current: 1 }
                }
            ];

            store.dispatch(changeCategoriesPage({ current: 1 }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("searchCategories should dispatch an action with type CATEGORY.SEARCH_CATEGORIES", function() {
            const expectedActions = [
                {
                    type: CATEGORY.SEARCH_CATEGORIES,
                    payload: { filter: {} }
                }
            ];

            store.dispatch(searchCategories({ filter: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("newCategoryForm should dispatch an action with type CATEGORY.CATEGORY_FORM_OPEN", function() {
            const expectedActions = [
                {
                    type: CATEGORY.CATEGORY_FORM_OPEN,
                    payload: {
                        category: {},
                        isNew: true
                    }
                }
            ];

            store.dispatch(newCategoryForm());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("editCategoryForm should dispatch an action with type CATEGORY.CATEGORY_FORM_OPEN", function() {
            const expectedActions = [
                {
                    type: CATEGORY.CATEGORY_FORM_OPEN,
                    payload: {
                        category: {
                            _id: "",
                            name: "category",
                            entityStatus: ENTITYSTATUS.ACTIVE
                        },
                        isNew: false
                    }
                }
            ];

            return store
                .dispatch(editCategoryForm({ client, _id: "" }))
                .then(function() {
                    expect(store.getActions()).toEqual(expectedActions);
                });
        });

        it("closeCategoryForm should dispatch an action with type CATEGORY.CATEGORY_FORM_CLOSE", function() {
            const expectedActions = [
                {
                    type: CATEGORY.CATEGORY_FORM_CLOSE
                }
            ];

            store.dispatch(closeCategoryForm());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it("changeCategoryForm should dispatch an action with type CATEGORY.CATEGORY_FORM_CHANGED", function() {
            const expectedActions = [
                {
                    type: CATEGORY.CATEGORY_FORM_CHANGED,
                    payload: { category: {} }
                }
            ];

            store.dispatch(changeCategoryForm({ category: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
}
