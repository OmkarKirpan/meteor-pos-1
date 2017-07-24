import { SUPPLIER } from "../../constants";
import update from "react-addons-update";

const initialState = {
    supplierList: {
        suppliers: [],
        error: false,
        loading: false,
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

const SupplierReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SUPPLIER.CHANGE_SUPPLIERS_PAGE:
            const { current } = payload;
            return update(state, {
                supplierList: {
                    current: { $set: current }
                }
            });
        case SUPPLIER.REFRESH_SUPPLIER_LIST_BEGIN:
            return update(state, {
                supplierList: {
                    error: { $set: false },
                    loading: { $set: true }
                }
            });
        case SUPPLIER.REFRESH_SUPPLIER_LIST_FINISHED:
            const { data, total } = payload;
            return update(state, {
                supplierList: {
                    error: { $set: false },
                    loading: { $set: false },
                    suppliers: { $set: data },
                    total: { $set: total }
                }
            });
        case SUPPLIER.REFRESH_SUPPLIER_LIST_FAILED:
            return update(state, {
                supplierList: {
                    error: { $set: true },
                    loading: { $set: false },
                    suppliers: { $set: [] }
                }
            });
        case SUPPLIER.SEARCH_SUPPLIERS:
            const { filter } = payload;
            return update(state, {
                supplierList: {
                    filter: { $set: filter }
                }
            });
        case SUPPLIER.SUPPLIER_FORM_OPEN:
            const { supplier, isNew } = payload;
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
        default:
            return state;
    }
};

export default SupplierReducer;
