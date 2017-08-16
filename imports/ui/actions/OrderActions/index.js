import { GETCUSTOMERS } from "../../graphql/queries/customer";
import { GETITEMS } from "../../graphql/queries/item";
import { GETORDER } from "../../graphql/queries/order";
import { ORDER } from "../actionTypes";
import { gql } from "react-apollo";
import moment from "moment";

const changeOrdersPage = ({ client, current }) => (dispatch, getState) => {
    dispatch({
        type: ORDER.CHANGE_ORDER_PAGE,
        payload: {
            current
        }
    });
};

const searchOrders = ({ client, filter }) => dispatch => {
    dispatch({
        type: ORDER.SEARCH_ORDERS,
        payload: {
            filter
        }
    });
};

const searchOrderCustomers = ({ client, filter }) => dispatch => {
    client
        .query({
            query: GETCUSTOMERS,
            fetchPolicy: "network-only",
            variables: {
                pageSize: 10,
                filter,
                skip: 0
            }
        })
        .then(response => {
            const { data } = response;
            const { customers } = data;
            dispatch({
                type: ORDER.REFRESH_CUSTOMERS,
                payload: { customers }
            });
        })
        .catch(error =>
            dispatch({
                type: ORDER.REFRESH_CUSTOMERS_FAILED
            })
        );
};

const searchOrderItems = ({ client, filter }) => dispatch => {
    client
        .query({
            query: GETITEMS,
            fetchPolicy: "network-only",
            variables: {
                pageSize: 10,
                filter,
                skip: 0
            }
        })
        .then(response => {
            const { data } = response;
            const { items } = data;
            dispatch({
                type: ORDER.REFRESH_ITEMS,
                payload: { items }
            });
        })
        .catch(error =>
            dispatch({
                type: ORDER.REFRESH_ITEMS_FAILED
            })
        );
};

const newOrderForm = ({ client }) => dispatch => {
    dispatch({
        type: ORDER.ORDER_FORM_OPEN,
        payload: {
            isNew: true,
            order: { orderDate: moment() }
        }
    });
};

const editOrderForm = ({ client, _id }) => dispatch => {
    client
        .query({
            query: GETORDER,
            fetchPolicy: "network-only",
            variables: {
                _id
            }
        })
        .then(response => {
            const { data } = response;
            const { order } = data;
            dispatch({
                type: ORDER.ORDER_FORM_OPEN,
                payload: {
                    order,
                    isNew: false
                }
            });
        })
        .catch(error => console.error(error));
};

const closeOrderForm = () => dispatch => {
    dispatch({
        type: ORDER.ORDER_FORM_CLOSE
    });
};

const changeOrderForm = ({ order }) => dispatch => {
    dispatch({
        type: ORDER.ORDER_FORM_CHANGED,
        payload: { order }
    });
};

const newOrderItemForm = () => dispatch => {
    dispatch({
        type: ORDER.ORDER_ITEM_FORM_OPEN,
        payload: {
            isNew: true
        }
    });
};

const editOrderItemForm = ({ itemId }) => dispatch => {
    dispatch({
        type: ORDER.ORDER_ITEM_FORM_OPEN,
        payload: {
            isNew: false,
            itemId
        }
    });
};

const closeOrderItemForm = () => dispatch => {
    dispatch({
        type: ORDER.ORDER_ITEM_FORM_CLOSE
    });
};

const changeOrderItemForm = ({ orderItem }) => dispatch => {
    dispatch({
        type: ORDER.ORDER_ITEM_FORM_CHANGED,
        payload: { orderItem }
    });
};

export {
    changeOrdersPage,
    newOrderForm,
    closeOrderForm,
    searchOrders,
    editOrderForm,
    searchOrderCustomers,
    changeOrderForm,
    searchOrderItems,
    newOrderItemForm,
    editOrderItemForm,
    closeOrderItemForm,
    changeOrderItemForm
};
