import { SUPPLIER } from "../../constants";
import update from "react-addons-update";

const initialState = {
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
    const { current, total, filter, isNew, supplier } = payload;
    switch (type) {
        case SUPPLIER.CHANGE_SUPPLIER_PAGE:
            return update(state, {
                supplierList: {
                    current: { $set: current }
                }
            });
        case SUPPLIER.SEARCH_SUPPLIERS:
            return update(state, {
                supplierList: {
                    filter: { $set: filter }
                }
            });
        case SUPPLIER.SUPPLIER_FORM_OPEN:
            return update(state, {
                supplierForm: {
                    isNew: { $set: isNew },
                    editingSupplier: { $set: supplier },
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
                    editingSupplier: { $merge: supplier }
                }
            });
        default:
            return state;
    }
};

export default SupplierReducer;
