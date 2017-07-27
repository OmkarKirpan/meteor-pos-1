import { gql } from "react-apollo";

const CREATESUPPLIER = gql`
    mutation createSupplier($supplier: CreateSupplierInput!) {
        createSupplier(supplier: $supplier)
    }
`;

const UPDATESUPPLIER = gql`
    mutation updateSupplier($supplier: UpdateSupplierInput!) {
        updateSupplier(supplier: $supplier)
    }
`;
const UPDATESUPPLIERSTATUS = gql`
    mutation updateSupplierStatus($_id: String!, $newStatus: Int!) {
        updateSupplierStatus(_id: $_id, newStatus: $newStatus)
    }
`;
export { CREATESUPPLIER, UPDATESUPPLIER, UPDATESUPPLIERSTATUS };
