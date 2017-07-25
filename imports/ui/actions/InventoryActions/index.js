import { GETCATEGORIES, GETCATEGORY } from "../../graphql/queries/category";

import { GETINVENTORY } from "../../graphql/queries/inventory";
import { INVENTORY } from "../../constants";
import { gql } from "react-apollo";

const changeInventoriesPage = ({ client, current }) => (dispatch, getState) => {
    dispatch({
        type: INVENTORY.CHANGE_INVENTORY_PAGE,
        payload: {
            current
        }
    });
};

const searchInventories = ({ client, filter }) => dispatch => {
    dispatch({
        type: INVENTORY.SEARCH_INVENTORIES,
        payload: {
            filter
        }
    });
};

const searchInventoryCategories = ({ client, filter }) => dispatch => {
    client
        .query({
            query: GETCATEGORIES,
            fetchPolicy: "network-only",
            variables: {
                pageSize: 10,
                filter,
                skip: 0
            }
        })
        .then(response => {
            const { data } = response;
            const { categories } = data;
            dispatch({
                type: INVENTORY.REFRESH_CATEGORIES,
                payload: { categories: categories }
            });
        })
        .catch(error =>
            dispatch({
                type: INVENTORY.REFRESH_CATEGORIES_FAILED
            })
        );
};

const getInventoryCategory = ({ client, categoryId }) => dispatch => {
    client
        .query({
            query: GETCATEGORY,
            variables: {
                _id: categoryId
            }
        })
        .then(response => {
            const { data } = response;
            const { category } = data;
            dispatch({
                type: INVENTORY.REFRESH_CATEGORIES,
                payload: { categories: [category] }
            });
        })
        .catch(error =>
            dispatch({
                type: INVENTORY.REFRESH_CATEGORIES_FAILED
            })
        );
};

const newInventoryForm = ({ client }) => dispatch => {
    dispatch({
        type: INVENTORY.INVENTORY_FORM_OPEN,
        payload: {
            inventory: { newPriceCount: 0 },
            isNew: true
        }
    });
};

const editInventoryForm = ({ client, _id }) => dispatch => {
    client
        .query({
            query: GETINVENTORY,
            variables: {
                _id
            }
        })
        .then(response => {
            const { data } = response;
            const { inventory } = data;
            dispatch(
                getInventoryCategory({
                    client,
                    categoryId: inventory.categoryId
                })
            );
            dispatch({
                type: INVENTORY.INVENTORY_FORM_OPEN,
                payload: {
                    inventory: { ...inventory, newPriceCount: 0 },
                    isNew: false
                }
            });
        })
        .catch(error => console.dir(error));
};

const closeInventoryForm = () => dispatch => {
    dispatch({
        type: INVENTORY.INVENTORY_FORM_CLOSE
    });
};

const changeInventoryForm = ({ inventory }) => dispatch => {
    dispatch({
        type: INVENTORY.INVENTORY_FORM_CHANGED,
        payload: { inventory }
    });
};

export {
    changeInventoriesPage,
    newInventoryForm,
    closeInventoryForm,
    searchInventories,
    editInventoryForm,
    searchInventoryCategories,
    changeInventoryForm,
    getInventoryCategory
};
