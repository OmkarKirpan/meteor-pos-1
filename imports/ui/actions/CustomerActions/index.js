import { CUSTOMER } from "../../../constants";
import { gql } from "react-apollo";

const fetchCustomers = ({ client }) => (dispatch, getState) => {
    const { customer } = getState();
    const { customerList } = customer;
    const { current, pageSize, filter, sort } = customerList;

    dispatch({
        type: CUSTOMER.REFRESH_CUSTOMER_LIST_BEGIN
    });
    const getCustomers = gql`
        query customers(
            $current: Int!
            $pageSize: Int!
            $filter: FilterFindManycustomerInput
            $countFilter: FiltercustomerInput
            $sort: SortFindManycustomerInput
        ) {
            customers(
                skip: $current
                limit: $pageSize
                sort: $sort
                filter: $filter
            ) {
                _id
                name
                address
                phoneNumber
                status
            }
            customerCount(filter: $countFilter)
        }
    `;
    client
        .query({
            query: getCustomers,
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
            const { customers, customerCount } = data;
            dispatch({
                type: CUSTOMER.REFRESH_CUSTOMER_LIST_FINISHED,
                payload: { data: customers, total: customerCount }
            });
        })
        .catch(error =>
            dispatch({
                type: CUSTOMER.REFRESH_CUSTOMER_LIST_FAILED
            })
        );
};

const changeCustomersPage = ({ client, current }) => (dispatch, getState) => {
    dispatch({
        type: CUSTOMER.CHANGE_CUSTOMERS_PAGE,
        payload: {
            current
        }
    });
    dispatch(fetchCustomers({ client }));
};

const searchCustomers = ({ client, filter }) => dispatch => {
    dispatch({
        type: CUSTOMER.SEARCH_CUSTOMERS,
        payload: {
            filter
        }
    });
    dispatch(fetchCustomers({ client }));
};

const newCustomerForm = () => dispatch => {
    dispatch({
        type: CUSTOMER.CUSTOMER_FORM_OPEN,
        payload: {
            customer: {},
            isNew: true
        }
    });
};

const editCustomerForm = ({ client, _id }) => dispatch => {
    const getCustomer = gql`
        query customer($_id: MongoID!) {
            customer(_id: $_id) {
                _id
                name
                address
                phoneNumber
            }
        }
    `;
    client
        .query({
            query: getCustomer,
            variables: {
                _id
            }
        })
        .then(response => {
            const { data } = response;
            const { customer } = data;
            dispatch({
                type: CUSTOMER.CUSTOMER_FORM_OPEN,
                payload: {
                    customer,
                    isNew: false
                }
            });
        })
        .catch(error => console.dir(error));
};

const createCustomer = ({ client, customer }) => dispatch => {
    let { _id, name, address, phoneNumber } = customer;
    let newCustomer = { _id, name, address, phoneNumber };
    client
        .mutate({
            mutation: gql`
                mutation addCustomer($customer: CreateOnecustomerInput!) {
                    addCustomer(record: $customer) {
                        recordId
                    }
                }
            `,
            variables: {
                customer: newCustomer
            }
        })
        .then(response => {
            dispatch({
                type: CUSTOMER.CUSTOMER_FORM_CLOSE
            });
            dispatch(fetchCustomers({ client }));
        })
        .catch(error => console.dir(error));
};

const updateCustomer = ({ client, customer }) => dispatch => {
    const { _id, name, address, phoneNumber } = customer;
    const updatedCustomer = { _id, name, address, phoneNumber };

    client
        .mutate({
            mutation: gql`
                mutation updateCustomer($customer: UpdateByIdcustomerInput!) {
                    updateCustomer(record: $customer) {
                        recordId
                    }
                }
            `,
            variables: {
                customer: updatedCustomer
            }
        })
        .then(response => {
            dispatch({
                type: CUSTOMER.CUSTOMER_FORM_CLOSE
            });
            dispatch(fetchCustomers({ client }));
        })
        .catch(error => console.dir(error));
};

const closeCustomerForm = () => dispatch => {
    dispatch({
        type: CUSTOMER.CUSTOMER_FORM_CLOSE
    });
};

const deleteCustomer = ({ client, _id, newStatus }) => (dispatch, getState) => {
    client
        .mutate({
            mutation: gql`
                mutation deleteCustomer($_id: MongoID!, $status: Float!) {
                    updateCustomer(record: { _id: $_id, status: $status }) {
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
            dispatch(fetchCustomers({ client }));
        })
        .catch(error => console.dir(error));
};

export {
    changeCustomersPage,
    fetchCustomers,
    newCustomerForm,
    createCustomer,
    closeCustomerForm,
    searchCustomers,
    deleteCustomer,
    editCustomerForm,
    updateCustomer
};
