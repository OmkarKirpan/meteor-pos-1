import { INVOICE } from "../../constants";
import { gql } from "react-apollo";

const fetchInvoices = ({ client }) => (dispatch, getState) => {
    const { invoice } = getState();
    const { invoiceList } = invoice;
    const { current, pageSize, filter, sort } = invoiceList;

    dispatch({
        type: INVOICE.REFRESH_INVOICE_LIST_BEGIN
    });
    const getInvoices = gql`
        query invoices(
            $current: Int!
            $pageSize: Int!
            $filter: FilterFindManyinvoiceInput
            $countFilter: FilterinvoiceInput
            $sort: SortFindManyinvoiceInput
        ) {
            invoices(
                skip: $current
                limit: $pageSize
                sort: $sort
                filter: $filter
            ) {
                _id
                invoiceDate
                customer {
                    _id
                    name
                    address
                    phoneNumber
                }
                invoiceItems {
                    itemId
                    itemName
                    amount
                    unit
                    price
                    discount
                }
                status
            }
            invoiceCount(filter: $countFilter)
        }
    `;
    client
        .query({
            query: getInvoices,
            fetchPolicy: "network-only",
            variables: {
                current: (current - 1) * pageSize,
                pageSize,
                filter,
                countFilter: filter,
                sort
            }
        })
        .then(response => {
            const { data } = response;
            const { invoices, invoiceCount } = data;
            dispatch({
                type: INVOICE.REFRESH_INVOICE_LIST_FINISHED,
                payload: { data: invoices, total: invoiceCount }
            });
        })
        .catch(error =>
            dispatch({
                type: INVOICE.REFRESH_INVOICE_LIST_FAILED
            })
        );
};

const changeInvoicesPage = ({ client, current }) => (dispatch, getState) => {
    dispatch({
        type: INVOICE.CHANGE_INVOICE_PAGE,
        payload: {
            current
        }
    });
    dispatch(fetchInvoices({ client }));
};

const searchInvoices = ({ client, filter }) => dispatch => {
    dispatch({
        type: INVOICE.SEARCH_INVOICES,
        payload: {
            filter
        }
    });
    dispatch(fetchInvoices({ client }));
};

const newInvoiceForm = () => dispatch => {
    dispatch({
        type: INVOICE.INVOICE_FORM_OPEN,
        payload: {
            invoice: {},
            isNew: true
        }
    });
};

const editInvoiceForm = ({ client, _id }) => dispatch => {
    const getInvoice = gql`
        query invoice($_id: MongoID!) {
            invoice(_id: $_id) {
                _id
                name
                basePrice
                baseUnit
                stock
                status
                prices {
                    _id
                    unit
                    price
                    multiplier
                }
            }
        }
    `;
    client
        .query({
            query: getInvoice,
            variables: {
                _id
            }
        })
        .then(response => {
            const { data } = response;
            const { invoice } = data;
            dispatch({
                type: INVOICE.INVOICE_FORM_OPEN,
                payload: {
                    invoice,
                    isNew: false
                }
            });
        })
        .catch(error => console.dir(error));
};

const createInvoice = ({ client, invoice }) => dispatch => {
    const { _id, name, baseUnit, basePrice, stock, prices } = invoice;
    const newInvoice = { _id, name, baseUnit, basePrice, stock, prices };
    client
        .mutate({
            mutation: gql`
                mutation addInvoice($invoice: CreateOneinvoiceInput!) {
                    addInvoice(record: $invoice) {
                        recordId
                    }
                }
            `,
            variables: {
                invoice: newInvoice
            }
        })
        .then(response => {
            dispatch({
                type: INVOICE.INVOICE_FORM_CLOSE
            });
            dispatch(fetchInvoices({ client }));
        })
        .catch(error => console.dir(error));
};

const updateInvoice = ({ client, invoice }) => (dispatch, getState) => {
    const { _id, name, baseUnit, basePrice, stock, prices } = invoice;
    const updatedInvoice = { _id, name, baseUnit, basePrice, stock, prices };
    client
        .mutate({
            mutation: gql`
                mutation updateInvoice($invoice: UpdateByIdinvoiceInput!) {
                    updateInvoice(record: $invoice) {
                        recordId
                    }
                }
            `,
            variables: {
                invoice: updatedInvoice
            }
        })
        .then(response => {
            dispatch({
                type: INVOICE.INVOICE_FORM_CLOSE
            });
            dispatch(fetchInvoices({ client }));
        })
        .catch(error => console.dir(error));
};

const closeInvoiceForm = () => dispatch => {
    dispatch({
        type: INVOICE.INVOICE_FORM_CLOSE
    });
};

const deleteInvoice = ({ client, _id, newStatus }) => (dispatch, getState) => {
    client
        .mutate({
            mutation: gql`
                mutation deleteInvoice($_id: MongoID!, $status: Float!) {
                    updateInvoice(record: { _id: $_id, status: $status }) {
                        recordId
                    }
                }
            `,
            variables: {
                _id,
                status: newStatus
            }
        })
        .then(response => {
            dispatch(fetchInvoices({ client }));
        })
        .catch(error => console.dir(error));
};

export {
    changeInvoicesPage,
    fetchInvoices,
    newInvoiceForm,
    createInvoice,
    closeInvoiceForm,
    searchInvoices,
    deleteInvoice,
    editInvoiceForm,
    updateInvoice
};
