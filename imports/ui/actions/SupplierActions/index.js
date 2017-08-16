import { GETSUPPLIER, GETSUPPLIERS } from "../../graphql/queries/supplier";

import { SUPPLIER } from "../actionTypes";
import { gql } from "react-apollo";

const changeSuppliersPage = ({ client, current }) => (dispatch, getState) => {
    dispatch({
        type: SUPPLIER.CHANGE_SUPPLIER_PAGE,
        payload: {
            current
        }
    });
};

const searchSuppliers = ({ client, filter }) => dispatch => {
    dispatch({
        type: SUPPLIER.SEARCH_SUPPLIERS,
        payload: {
            filter
        }
    });
};

const newSupplierForm = ({ client }) => dispatch => {
    dispatch({
        type: SUPPLIER.SUPPLIER_FORM_OPEN,
        payload: {
            supplier: {},
            isNew: true
        }
    });
};

const editSupplierForm = ({ client, _id }) => dispatch => {
    client
        .query({
            query: GETSUPPLIER,
            fetchPolicy: "network-only",
            variables: {
                _id
            }
        })
        .then(response => {
            const { data } = response;
            const { supplier } = data;
            dispatch({
                type: SUPPLIER.SUPPLIER_FORM_OPEN,
                payload: {
                    supplier: { ...supplier },
                    isNew: false
                }
            });
        })
        .catch(error => console.error(error));
};

const closeSupplierForm = () => dispatch => {
    dispatch({
        type: SUPPLIER.SUPPLIER_FORM_CLOSE
    });
};

const changeSupplierForm = ({ supplier }) => dispatch => {
    dispatch({
        type: SUPPLIER.SUPPLIER_FORM_CHANGED,
        payload: { supplier }
    });
};

export {
    changeSuppliersPage,
    newSupplierForm,
    closeSupplierForm,
    searchSuppliers,
    editSupplierForm,
    changeSupplierForm
};
