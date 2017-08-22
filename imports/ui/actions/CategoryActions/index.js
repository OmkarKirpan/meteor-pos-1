import { GETCATEGORIES, GETCATEGORY } from "../../graphql/queries/category";

import { CATEGORY } from "../actionTypes";
import { gql } from "react-apollo";

const changeCategoriesPage = ({ current }) => (dispatch, getState) => {
    dispatch({
        type: CATEGORY.CHANGE_CATEGORY_PAGE,
        payload: {
            current
        }
    });
};

const searchCategories = ({ filter }) => dispatch => {
    dispatch({
        type: CATEGORY.SEARCH_CATEGORIES,
        payload: {
            filter
        }
    });
};

const newCategoryForm = () => dispatch => {
    dispatch({
        type: CATEGORY.CATEGORY_FORM_OPEN,
        payload: {
            category: {},
            isNew: true
        }
    });
};

const editCategoryForm = ({ client, _id }) => dispatch => {
    return client
        .query({
            query: GETCATEGORY,
            fetchPolicy: "network-only",
            variables: {
                _id
            }
        })
        .then(response => {
            const { data } = response;
            const { category } = data;
            dispatch({
                type: CATEGORY.CATEGORY_FORM_OPEN,
                payload: {
                    category: { ...category },
                    isNew: false
                }
            });
        })
        .catch(error => console.error(error));
};

const closeCategoryForm = () => dispatch => {
    dispatch({
        type: CATEGORY.CATEGORY_FORM_CLOSE
    });
};

const changeCategoryForm = ({ category }) => dispatch => {
    dispatch({
        type: CATEGORY.CATEGORY_FORM_CHANGED,
        payload: { category }
    });
};

export {
    changeCategoriesPage,
    newCategoryForm,
    closeCategoryForm,
    searchCategories,
    editCategoryForm,
    changeCategoryForm
};
