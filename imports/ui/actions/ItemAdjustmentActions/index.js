import { GETITEMS } from "../../graphql/queries/item";
import { ITEM_ADJUSTMENT } from "../actionTypes";
import { gql } from "react-apollo";
import moment from "moment";

const changeItemAdjustmentsPage = ({ client, current }) => (
    dispatch,
    getState
) => {
    dispatch({
        type: ITEM_ADJUSTMENT.CHANGE_ITEM_ADJUSTMENT_PAGE,
        payload: {
            current
        }
    });
};

const searchItemAdjustments = ({ client, filter }) => dispatch => {
    dispatch({
        type: ITEM_ADJUSTMENT.SEARCH_ITEM_ADJUSTMENTS,
        payload: {
            filter
        }
    });
};

const searchItemAdjustmentItems = ({ client, filter }) => dispatch => {
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
                type: ITEM_ADJUSTMENT.REFRESH_ITEMS,
                payload: { items }
            });
        })
        .catch(error =>
            dispatch({
                type: ITEM_ADJUSTMENT.REFRESH_ITEMS_FAILED
            })
        );
};

const newItemAdjustmentForm = ({ client }) => dispatch => {
    dispatch({
        type: ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_OPEN,
        payload: {
            isNew: true,
            itemAdjustment: { adjustmentDate: moment() }
        }
    });
};

const closeItemAdjustmentForm = () => dispatch => {
    dispatch({
        type: ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_CLOSE
    });
};

const changeItemAdjustmentForm = ({ itemAdjustment }) => dispatch => {
    dispatch({
        type: ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_CHANGED,
        payload: { itemAdjustment }
    });
};

export {
    changeItemAdjustmentsPage,
    newItemAdjustmentForm,
    closeItemAdjustmentForm,
    searchItemAdjustments,
    changeItemAdjustmentForm,
    searchItemAdjustmentItems
};
