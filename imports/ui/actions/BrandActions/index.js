import { GETBRAND, GETBRANDS } from "../../graphql/queries/brand";

import { BRAND } from "../actionTypes";
import { gql } from "react-apollo";

const changeBrandsPage = ({ client, current }) => (dispatch, getState) => {
    dispatch({
        type: BRAND.CHANGE_BRAND_PAGE,
        payload: {
            current
        }
    });
};

const searchBrands = ({ client, filter }) => dispatch => {
    dispatch({
        type: BRAND.SEARCH_BRANDS,
        payload: {
            filter
        }
    });
};

const newBrandForm = ({ client }) => dispatch => {
    dispatch({
        type: BRAND.BRAND_FORM_OPEN,
        payload: {
            brand: {},
            isNew: true
        }
    });
};

const editBrandForm = ({ client, _id }) => dispatch => {
    client
        .query({
            query: GETBRAND,
            fetchPolicy: "network-only",
            variables: {
                _id
            }
        })
        .then(response => {
            const { data } = response;
            const { brand } = data;
            dispatch({
                type: BRAND.BRAND_FORM_OPEN,
                payload: {
                    brand: { ...brand },
                    isNew: false
                }
            });
        })
        .catch(error => console.error(error));
};

const closeBrandForm = () => dispatch => {
    dispatch({
        type: BRAND.BRAND_FORM_CLOSE
    });
};

const changeBrandForm = ({ brand }) => dispatch => {
    dispatch({
        type: BRAND.BRAND_FORM_CHANGED,
        payload: { brand }
    });
};

export {
    changeBrandsPage,
    newBrandForm,
    closeBrandForm,
    searchBrands,
    editBrandForm,
    changeBrandForm
};
