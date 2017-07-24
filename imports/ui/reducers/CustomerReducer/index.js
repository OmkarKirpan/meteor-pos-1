import { CUSTOMER } from "../../constants";
import update from "react-addons-update";

const initialState = {
    customerList: {
        customers: [],
        error: false,
        loading: false,
        current: 1,
        pageSize: 10,
        total: 0,
        filter: {},
        sort: "CREATED_AT_DESC"
    },
    customerForm: {
        isNew: true,
        visible: false,
        editingCustomer: {}
    }
};

const CustomerReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case CUSTOMER.CHANGE_CUSTOMERS_PAGE:
            const { current } = payload;
            return update(state, {
                customerList: {
                    current: { $set: current }
                }
            });
        case CUSTOMER.REFRESH_CUSTOMER_LIST_BEGIN:
            return update(state, {
                customerList: {
                    error: { $set: false },
                    loading: { $set: true }
                }
            });
        case CUSTOMER.REFRESH_CUSTOMER_LIST_FINISHED:
            const { data, total } = payload;
            return update(state, {
                customerList: {
                    error: { $set: false },
                    loading: { $set: false },
                    customers: { $set: data },
                    total: { $set: total }
                }
            });
        case CUSTOMER.REFRESH_CUSTOMER_LIST_FAILED:
            return update(state, {
                customerList: {
                    error: { $set: true },
                    loading: { $set: false },
                    customers: { $set: [] }
                }
            });
        case CUSTOMER.SEARCH_CUSTOMERS:
            const { filter } = payload;
            return update(state, {
                customerList: {
                    filter: { $set: filter }
                }
            });
        case CUSTOMER.CUSTOMER_FORM_OPEN:
            const { customer, isNew } = payload;
            return update(state, {
                customerForm: {
                    isNew: { $set: isNew },
                    editingCustomer: { $set: customer },
                    visible: { $set: true }
                }
            });
        case CUSTOMER.CUSTOMER_FORM_CLOSE:
            return update(state, {
                customerForm: {
                    visible: { $set: false },
                    editingCustomer: { $set: {} }
                }
            });
        default:
            return state;
    }
};

export default CustomerReducer;
