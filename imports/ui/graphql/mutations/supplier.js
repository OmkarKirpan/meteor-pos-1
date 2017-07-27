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

export { CREATESUPPLIER, UPDATESUPPLIER };
