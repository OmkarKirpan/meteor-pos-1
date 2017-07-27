import { gql } from "react-apollo";

const GETSUPPLIERS = gql`
    query suppliers(
        $skip: Int!
        $pageSize: Int!
        $filter: SupplierSearchFilter
    ) {
        suppliers(skip: $skip, pageSize: $pageSize, filter: $filter) {
            _id
            name
            address
            phoneNumber
            status
        }
    }
`;

const GETSUPPLIER = gql`
    query supplier($_id: String!) {
        supplier(_id: $_id) {
            _id
            name
            address
            phoneNumber
            status
        }
    }
`;

export { GETSUPPLIERS, GETSUPPLIER };
