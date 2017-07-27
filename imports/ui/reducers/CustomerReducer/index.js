import { CUSTOMER } from "../../constants";
import update from "react-addons-update";

const initialState = {
    customerList: {
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

const CustomerReducer = (state = initialState, { type, payload = {} }) => {
    const { current, total, filter, isNew, customer } = payload;
    switch (type) {
        case CUSTOMER.CHANGE_CUSTOMER_PAGE:
            return update(state, {
                customerList: {
                    current: { $set: current }
                }
            });
        case CUSTOMER.SEARCH_CUSTOMERS:
            return update(state, {
                customerList: {
                    filter: { $set: filter }
                }
            });
        case CUSTOMER.CUSTOMER_FORM_OPEN:
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
        case CUSTOMER.CUSTOMER_FORM_CHANGED:
            return update(state, {
                customerForm: {
                    editingCustomer: { $merge: customer }
                }
            });
        default:
            return state;
    }
};

export default CustomerReducer;
