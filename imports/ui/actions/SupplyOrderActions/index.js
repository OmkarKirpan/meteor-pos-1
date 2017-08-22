import { GETITEMS } from "../../graphql/queries/item";
import { GETSUPPLIERS } from "../../graphql/queries/supplier";
import { SUPPLY_ORDER } from "../actionTypes";
import { gql } from "react-apollo";
import moment from "moment";

const changeSupplyOrdersPage = ({ current }) => (dispatch, getState) => {
    dispatch({
        type: SUPPLY_ORDER.CHANGE_SUPPLY_ORDER_PAGE,
        payload: {
            current
        }
    });
};

const searchSupplyOrders = ({ filter }) => dispatch => {
    dispatch({
        type: SUPPLY_ORDER.SEARCH_SUPPLY_ORDERS,
        payload: {
            filter
        }
    });
};

const searchSupplyOrderSuppliers = ({ client, filter }) => dispatch => {
    return client
        .query({
            query: GETSUPPLIERS,
            fetchPolicy: "network-only",
            variables: {
                pageSize: 10,
                filter,
                skip: 0
            }
        })
        .then(response => {
            const { data } = response;
            const { suppliers } = data;
            dispatch({
                type: SUPPLY_ORDER.REFRESH_SUPPLIERS,
                payload: { suppliers }
            });
        })
        .catch(error =>
            dispatch({
                type: SUPPLY_ORDER.REFRESH_SUPPLIERS_FAILED
            })
        );
};

const searchSupplyOrderItems = ({ client, filter }) => dispatch => {
    return client
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
                type: SUPPLY_ORDER.REFRESH_ITEMS,
                payload: { items }
            });
        })
        .catch(error =>
            dispatch({
                type: SUPPLY_ORDER.REFRESH_ITEMS_FAILED
            })
        );
};

const newSupplyOrderForm = () => dispatch => {
    dispatch({
        type: SUPPLY_ORDER.SUPPLY_ORDER_FORM_OPEN,
        payload: {
            isNew: true,
            supplyOrder: { orderDate: moment(), discount: 0 }
        }
    });
};

const closeSupplyOrderForm = () => dispatch => {
    dispatch({
        type: SUPPLY_ORDER.SUPPLY_ORDER_FORM_CLOSE
    });
};

const changeSupplyOrderForm = ({ supplyOrder }) => dispatch => {
    dispatch({
        type: SUPPLY_ORDER.SUPPLY_ORDER_FORM_CHANGED,
        payload: { supplyOrder }
    });
};

export {
    changeSupplyOrdersPage,
    newSupplyOrderForm,
    closeSupplyOrderForm,
    searchSupplyOrders,
    changeSupplyOrderForm,
    searchSupplyOrderItems,
    searchSupplyOrderSuppliers
};
