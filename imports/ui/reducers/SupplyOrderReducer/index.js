import { SESSION, SUPPLY_ORDER } from "../../actions/actionTypes";

import { cloneDeep } from "lodash";
import moment from "moment";
import update from "react-addons-update";

export const initialState = {
    supplyOrderList: {
        current: 1,
        pageSize: 10,
        total: 0,
        filter: {},
        sort: "CREATED_AT_DESC"
    },
    supplyOrderForm: {
        isNew: true,
        visible: false,
        editingSupplyOrder: {},
        items: [],
        suppliers: []
    }
};

const SupplyOrderReducer = (state = initialState, { type, payload = {} }) => {
    switch (type) {
        case SUPPLY_ORDER.CHANGE_SUPPLY_ORDER_PAGE:
            return update(state, {
                supplyOrderList: {
                    current: { $set: payload.current }
                }
            });
        case SUPPLY_ORDER.SEARCH_SUPPLY_ORDERS:
            return update(state, {
                supplyOrderList: {
                    filter: { $merge: payload.filter },
                    current: { $set: 1 }
                }
            });
        case SUPPLY_ORDER.SUPPLY_ORDER_FORM_OPEN:
            const editingSupplyOrder = cloneDeep(payload.supplyOrder);
            editingSupplyOrder.supplyItemCount = 0;
            if (editingSupplyOrder.orderDate)
                editingSupplyOrder.orderDate = moment(
                    editingSupplyOrder.orderDate
                );
            if (!editingSupplyOrder.supplyItems)
                editingSupplyOrder.supplyItems = [];
            return update(state, {
                supplyOrderForm: {
                    isNew: { $set: payload.isNew },
                    editingSupplyOrder: { $set: editingSupplyOrder },
                    visible: { $set: true }
                }
            });
        case SUPPLY_ORDER.SUPPLY_ORDER_FORM_CLOSE:
            return update(state, {
                supplyOrderForm: {
                    visible: { $set: false },
                    editingSupplyOrder: { $set: {} }
                }
            });
        case SUPPLY_ORDER.SUPPLY_ORDER_FORM_CHANGED:
            return update(state, {
                supplyOrderForm: {
                    editingSupplyOrder: { $merge: payload.supplyOrder }
                }
            });
        case SUPPLY_ORDER.REFRESH_ITEMS:
            return update(state, {
                supplyOrderForm: {
                    items: { $set: payload.items }
                }
            });
        case SUPPLY_ORDER.REFRESH_SUPPLIERS:
            return update(state, {
                supplyOrderForm: {
                    suppliers: { $set: payload.suppliers }
                }
            });
        case SESSION.LOGGED_IN:
        case SESSION.LOGGED_OUT:
            return initialState;
        default:
            return state;
    }
};

export default SupplyOrderReducer;
