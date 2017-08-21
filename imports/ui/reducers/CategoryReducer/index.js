import { CATEGORY, SESSION } from "../../actions/actionTypes";

import update from "react-addons-update";

const initialState = {
    categoryList: {
        current: 1,
        pageSize: 10,
        total: 0,
        filter: {},
        sort: "CREATED_AT_DESC"
    },
    categoryForm: {
        isNew: true,
        visible: false,
        editingCategory: {}
    }
};

const CategoryReducer = (state = initialState, { type, payload = {} }) => {
    switch (type) {
        case CATEGORY.CHANGE_CATEGORY_PAGE:
            return update(state, {
                categoryList: {
                    current: { $set: payload.current }
                }
            });
        case CATEGORY.SEARCH_CATEGORIES:
            return update(state, {
                categoryList: {
                    filter: { $merge: payload.filter }
                }
            });
        case CATEGORY.CATEGORY_FORM_OPEN:
            return update(state, {
                categoryForm: {
                    isNew: { $set: payload.isNew },
                    editingCategory: { $set: payload.category },
                    visible: { $set: true }
                }
            });
        case CATEGORY.CATEGORY_FORM_CLOSE:
            return update(state, {
                categoryForm: {
                    visible: { $set: false },
                    editingCategory: { $set: {} }
                }
            });
        case CATEGORY.CATEGORY_FORM_CHANGED:
            return update(state, {
                categoryForm: {
                    editingCategory: { $merge: payload.category }
                }
            });
        case SESSION.LOGGED_IN:
        case SESSION.LOGGED_OUT:
            return initialState;
        default:
            return state;
    }
};

export default CategoryReducer;
