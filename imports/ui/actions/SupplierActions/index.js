import { SUPPLIER } from "../../constants";
import { gql } from "react-apollo";

const fetchSuppliers = ({ client }) => (dispatch, getState) => {
    const { supplier } = getState();
    const { supplierList } = supplier;
    const { current, pageSize, filter, sort } = supplierList;

    dispatch({
        type: SUPPLIER.REFRESH_SUPPLIER_LIST_BEGIN
    });
    const getSuppliers = gql`
        query suppliers(
            $current: Int!
            $pageSize: Int!
            $filter: FilterFindManysupplierInput
            $countFilter: FiltersupplierInput
            $sort: SortFindManysupplierInput
        ) {
            suppliers(
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
            supplierCount(filter: $countFilter)
        }
    `;
    client
        .query({
            query: getSuppliers,
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
            const { suppliers, supplierCount } = data;
            dispatch({
                type: SUPPLIER.REFRESH_SUPPLIER_LIST_FINISHED,
                payload: { data: suppliers, total: supplierCount }
            });
        })
        .catch(error =>
            dispatch({
                type: SUPPLIER.REFRESH_SUPPLIER_LIST_FAILED
            })
        );
};

const changeSuppliersPage = ({ client, current }) => (dispatch, getState) => {
    dispatch({
        type: SUPPLIER.CHANGE_SUPPLIERS_PAGE,
        payload: {
            current
        }
    });
    dispatch(fetchSuppliers({ client }));
};

const searchSuppliers = ({ client, filter }) => dispatch => {
    dispatch({
        type: SUPPLIER.SEARCH_SUPPLIERS,
        payload: {
            filter
        }
    });
    dispatch(fetchSuppliers({ client }));
};

const newSupplierForm = () => dispatch => {
    dispatch({
        type: SUPPLIER.SUPPLIER_FORM_OPEN,
        payload: {
            supplier: {},
            isNew: true
        }
    });
};

const editSupplierForm = ({ client, _id }) => dispatch => {
    const getSupplier = gql`
        query supplier($_id: MongoID!) {
            supplier(_id: $_id) {
                _id
                name
                address
                phoneNumber
            }
        }
    `;
    client
        .query({
            query: getSupplier,
            variables: {
                _id
            }
        })
        .then(response => {
            const { data } = response;
            const { supplier } = data;
            dispatch({
                type: SUPPLIER.SUPPLIER_FORM_OPEN,
                payload: {
                    supplier,
                    isNew: false
                }
            });
        })
        .catch(error => console.dir(error));
};

const createSupplier = ({ client, supplier }) => dispatch => {
    let { _id, name, address, phoneNumber } = supplier;
    let newSupplier = { _id, name, address, phoneNumber };
    client
        .mutate({
            mutation: gql`
                mutation addSupplier($supplier: CreateOnesupplierInput!) {
                    addSupplier(record: $supplier) {
                        recordId
                    }
                }
            `,
            variables: {
                supplier: newSupplier
            }
        })
        .then(response => {
            dispatch({
                type: SUPPLIER.SUPPLIER_FORM_CLOSE
            });
            dispatch(fetchSuppliers({ client }));
        })
        .catch(error => console.dir(error));
};

const updateSupplier = ({ client, supplier }) => dispatch => {
    const { _id, name, address, phoneNumber } = supplier;
    const updatedSupplier = { _id, name, address, phoneNumber };

    client
        .mutate({
            mutation: gql`
                mutation updateSupplier($supplier: UpdateByIdsupplierInput!) {
                    updateSupplier(record: $supplier) {
                        recordId
                    }
                }
            `,
            variables: {
                supplier: updatedSupplier
            }
        })
        .then(response => {
            dispatch({
                type: SUPPLIER.SUPPLIER_FORM_CLOSE
            });
            dispatch(fetchSuppliers({ client }));
        })
        .catch(error => console.dir(error));
};

const closeSupplierForm = () => dispatch => {
    dispatch({
        type: SUPPLIER.SUPPLIER_FORM_CLOSE
    });
};

const deleteSupplier = ({ client, _id, newStatus }) => (dispatch, getState) => {
    client
        .mutate({
            mutation: gql`
                mutation deleteSupplier($_id: MongoID!, $status: Float!) {
                    updateSupplier(record: { _id: $_id, status: $status }) {
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
            dispatch(fetchSuppliers({ client }));
        })
        .catch(error => console.dir(error));
};

export {
    changeSuppliersPage,
    fetchSuppliers,
    newSupplierForm,
    createSupplier,
    closeSupplierForm,
    searchSuppliers,
    deleteSupplier,
    editSupplierForm,
    updateSupplier
};
