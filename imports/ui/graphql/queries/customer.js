import { gql } from "react-apollo";

const GETCUSTOMERS = gql`
    query customers(
        $skip: Int!
        $pageSize: Int!
        $filter: CustomerSearchFilter
    ) {
        customers(skip: $skip, pageSize: $pageSize, filter: $filter) {
            _id
            name
            address
            phoneNumber
            cellphoneNumber
            entityStatus
        }
    }
`;

const GETCUSTOMER = gql`
    query customer($_id: String!) {
        customer(_id: $_id) {
            _id
            name
            address
            phoneNumber
            cellphoneNumber
            entityStatus
        }
    }
`;

export { GETCUSTOMERS, GETCUSTOMER };
