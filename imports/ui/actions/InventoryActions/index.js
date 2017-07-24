import { GETINVENTORIES, GETINVENTORY } from "../../graphql/queries/inventory";

import { GETINVENTORYCATEGORIES } from "../../graphql/queries/inventoryCategory";
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

const searchCategories = ({ client, filter }) => dispatch => {
    client
        .query({
            query: GETINVENTORYCATEGORIES,
            fetchPolicy: "network-only",
            variables: {
                limit: 10,
                filter
            }
        })
        .then(response => {
            const { data } = response;
            const { inventoryCategories } = data;
            dispatch({
                type: INVENTORY.REFRESH_CATEGORIES,
                payload: { categories: inventoryCategories }
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
            dispatch(searchCategories({ client }));
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
    searchCategories,
    changeInventoryForm
};
