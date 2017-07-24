import { INVOICE } from "../../constants";
import update from "react-addons-update";

const initialState = {
    invoiceList: {
        invoices: [],
        error: false,
        loading: false,
        current: 1,
        pageSize: 10,
        total: 0,
        filter: {},
        sort: "CREATED_AT_DESC"
    },
    invoiceForm: {
        isNew: true,
        visible: false,
        editingInvoice: {}
    }
};

const InvoiceReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case INVOICE.CHANGE_INVOICE_PAGE:
            const { current } = payload;
            return update(state, {
                invoiceList: {
                    current: { $set: current }
                }
            });
        case INVOICE.REFRESH_INVOICE_LIST_BEGIN:
            return update(state, {
                invoiceList: {
                    error: { $set: false },
                    loading: { $set: true }
                }
            });
        case INVOICE.REFRESH_INVOICE_LIST_FINISHED:
            const { data, total } = payload;
            return update(state, {
                invoiceList: {
                    error: { $set: false },
                    loading: { $set: false },
                    invoices: { $set: data },
                    total: { $set: total }
                }
            });
        case INVOICE.REFRESH_INVOICE_LIST_FAILED:
            return update(state, {
                invoiceList: {
                    error: { $set: true },
                    loading: { $set: false },
                    invoices: { $set: [] }
                }
            });
        case INVOICE.SEARCH_INVOICES:
            const { filter } = payload;
            return update(state, {
                invoiceList: {
                    filter: { $set: filter }
                }
            });
        case INVOICE.INVOICE_FORM_OPEN:
            const { invoice, isNew } = payload;
            return update(state, {
                invoiceForm: {
                    isNew: { $set: isNew },
                    editingInvoice: { $set: invoice },
                    visible: { $set: true }
                }
            });
        case INVOICE.INVOICE_FORM_CLOSE:
            return update(state, {
                invoiceForm: {
                    visible: { $set: false },
                    editingInvoice: { $set: {} }
                }
            });
        default:
            return state;
    }
};

export default InvoiceReducer;
