import { GETBRANDS } from "../../graphql/queries/brand";
import { GETCATEGORIES } from "../../graphql/queries/category";
import { GETITEM } from "../../graphql/queries/item";
import { ITEM } from "../actionTypes";
import { gql } from "react-apollo";

const changeItemsPage = ({ client, current }) => (dispatch, getState) => {
    dispatch({
        type: ITEM.CHANGE_ITEM_PAGE,
        payload: {
            current
        }
    });
};

const searchItems = ({ client, filter }) => dispatch => {
    dispatch({
        type: ITEM.SEARCH_ITEMS,
        payload: {
            filter
        }
    });
};

const searchItemCategories = ({ client, filter }) => dispatch => {
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
                type: ITEM.REFRESH_CATEGORIES,
                payload: { categories: categories }
            });
        })
        .catch(error =>
            dispatch({
                type: ITEM.REFRESH_CATEGORIES_FAILED
            })
        );
};

const searchItemBrands = ({ client, filter }) => dispatch => {
    client
        .query({
            query: GETBRANDS,
            fetchPolicy: "network-only",
            variables: {
                pageSize: 10,
                filter,
                skip: 0
            }
        })
        .then(response => {
            const { data } = response;
            const { brands } = data;
            dispatch({
                type: ITEM.REFRESH_BRANDS,
                payload: { brands: brands }
            });
        })
        .catch(error =>
            dispatch({
                type: ITEM.REFRESH_BRANDS_FAILED
            })
        );
};

const newItemForm = ({ client }) => dispatch => {
    dispatch({
        type: ITEM.ITEM_FORM_OPEN,
        payload: {
            item: {},
            isNew: true
        }
    });
};

const editItemForm = ({ client, _id }) => dispatch => {
    client
        .query({
            query: GETITEM,
            fetchPolicy: "network-only",
            variables: {
                _id
            }
        })
        .then(response => {
            const { data } = response;
            const { item } = data;
            item.category &&
                dispatch({
                    type: ITEM.REFRESH_CATEGORIES,
                    payload: {
                        categories: [item.category]
                    }
                });
            item.brand &&
                dispatch({
                    type: ITEM.REFRESH_BRANDS,
                    payload: {
                        brands: [item.brand]
                    }
                });
            dispatch({
                type: ITEM.ITEM_FORM_OPEN,
                payload: {
                    item: { ...item },
                    isNew: false
                }
            });
        })
        .catch(error => console.error(error));
};

const closeItemForm = () => dispatch => {
    dispatch({
        type: ITEM.ITEM_FORM_CLOSE
    });
};

const changeItemForm = ({ item }) => dispatch => {
    dispatch({
        type: ITEM.ITEM_FORM_CHANGED,
        payload: { item }
    });
};

export {
    changeItemsPage,
    newItemForm,
    closeItemForm,
    searchItems,
    editItemForm,
    searchItemCategories,
    changeItemForm,
    searchItemBrands
};
