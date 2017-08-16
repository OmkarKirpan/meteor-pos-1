import { GETCUSTOMER, GETCUSTOMERS } from "../../graphql/queries/customer";

import { CUSTOMER } from "../actionTypes";
import { gql } from "react-apollo";

const changeCustomersPage = ({ client, current }) => (dispatch, getState) => {
    dispatch({
        type: CUSTOMER.CHANGE_CUSTOMER_PAGE,
        payload: {
            current
        }
    });
};

const searchCustomers = ({ client, filter }) => dispatch => {
    dispatch({
        type: CUSTOMER.SEARCH_CUSTOMERS,
        payload: {
            filter
        }
    });
};

const newCustomerForm = ({ client }) => dispatch => {
    dispatch({
        type: CUSTOMER.CUSTOMER_FORM_OPEN,
        payload: {
            customer: {},
            isNew: true
        }
    });
};

const editCustomerForm = ({ client, _id }) => dispatch => {
    client
        .query({
            query: GETCUSTOMER,
            fetchPolicy: "network-only",
            variables: {
                _id
            }
        })
        .then(response => {
            const { data } = response;
            const { customer } = data;
            dispatch({
                type: CUSTOMER.CUSTOMER_FORM_OPEN,
                payload: {
                    customer: { ...customer },
                    isNew: false
                }
            });
        })
        .catch(error => console.error(error));
};

const closeCustomerForm = () => dispatch => {
    dispatch({
        type: CUSTOMER.CUSTOMER_FORM_CLOSE
    });
};

const changeCustomerForm = ({ customer }) => dispatch => {
    dispatch({
        type: CUSTOMER.CUSTOMER_FORM_CHANGED,
        payload: { customer }
    });
};

export {
    changeCustomersPage,
    newCustomerForm,
    closeCustomerForm,
    searchCustomers,
    editCustomerForm,
    changeCustomerForm
};
