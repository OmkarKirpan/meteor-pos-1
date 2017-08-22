import { SESSION, SUPPLIER } from "../../actions/actionTypes";

import update from "react-addons-update";

export const initialState = {
    supplierList: {
        current: 1,
        pageSize: 10,
        total: 0,
        filter: {},
        sort: "CREATED_AT_DESC"
    },
    supplierForm: {
        isNew: true,
        visible: false,
        editingSupplier: {}
    }
};

const SupplierReducer = (state = initialState, { type, payload = {} }) => {
    switch (type) {
        case SUPPLIER.CHANGE_SUPPLIER_PAGE:
            return update(state, {
                supplierList: {
                    current: { $set: payload.current }
                }
            });
        case SUPPLIER.SEARCH_SUPPLIERS:
            return update(state, {
                supplierList: {
                    filter: { $merge: payload.filter }
                }
            });
        case SUPPLIER.SUPPLIER_FORM_OPEN:
            return update(state, {
                supplierForm: {
                    isNew: { $set: payload.isNew },
                    editingSupplier: { $set: payload.supplier },
                    visible: { $set: true }
                }
            });
        case SUPPLIER.SUPPLIER_FORM_CLOSE:
            return update(state, {
                supplierForm: {
                    visible: { $set: false },
                    editingSupplier: { $set: {} }
                }
            });
        case SUPPLIER.SUPPLIER_FORM_CHANGED:
            return update(state, {
                supplierForm: {
                    editingSupplier: { $merge: payload.supplier }
                }
            });
        case SESSION.LOGGED_IN:
        case SESSION.LOGGED_OUT:
            return initialState;
        default:
            return state;
    }
};

export default SupplierReducer;
