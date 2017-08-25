import { ITEM_ADJUSTMENT, SESSION } from "../../actions/actionTypes";

import { cloneDeep } from "lodash";
import moment from "moment";
import update from "react-addons-update";

export const initialState = {
    itemAdjustmentList: {
        current: 1,
        pageSize: 10,
        total: 0,
        filter: {},
        sort: "CREATED_AT_DESC"
    },
    itemAdjustmentForm: {
        isNew: true,
        visible: false,
        editingItemAdjustment: {},
        items: []
    }
};

const ItemAdjustmentReducer = (
    state = initialState,
    { type, payload = {} }
) => {
    switch (type) {
        case ITEM_ADJUSTMENT.CHANGE_ITEM_ADJUSTMENT_PAGE:
            return update(state, {
                itemAdjustmentList: {
                    current: { $set: payload.current }
                }
            });
        case ITEM_ADJUSTMENT.SEARCH_ITEM_ADJUSTMENTS:
            return update(state, {
                itemAdjustmentList: {
                    filter: { $merge: payload.filter },
                    current: { $set: 1 }
                }
            });
        case ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_OPEN:
            const editingItemAdjustment = cloneDeep(payload.itemAdjustment);
            editingItemAdjustment.adjustmentItemCount = 0;
            if (editingItemAdjustment.adjustmentDate)
                editingItemAdjustment.adjustmentDate = moment(
                    editingItemAdjustment.adjustmentDate
                );
            if (!editingItemAdjustment.adjustmentItems)
                editingItemAdjustment.adjustmentItems = [];
            return update(state, {
                itemAdjustmentForm: {
                    isNew: { $set: payload.isNew },
                    editingItemAdjustment: { $set: editingItemAdjustment },
                    visible: { $set: true },
                    items: { $set: [] }
                }
            });
        case ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_CLOSE:
            return update(state, {
                itemAdjustmentForm: {
                    visible: { $set: false },
                    editingItemAdjustment: { $set: {} }
                }
            });
        case ITEM_ADJUSTMENT.ITEM_ADJUSTMENT_FORM_CHANGED:
            return update(state, {
                itemAdjustmentForm: {
                    editingItemAdjustment: { $merge: payload.itemAdjustment }
                }
            });
        case ITEM_ADJUSTMENT.REFRESH_ITEMS:
            return update(state, {
                itemAdjustmentForm: {
                    items: { $set: payload.items }
                }
            });
        case SESSION.LOGGED_IN:
        case SESSION.LOGGED_OUT:
            return initialState;
        default:
            return state;
    }
};

export default ItemAdjustmentReducer;
