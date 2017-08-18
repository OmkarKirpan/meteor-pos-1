import { gql } from "react-apollo";

const GETBRANDS = gql`
    query brands($skip: Int!, $pageSize: Int!, $filter: BrandSearchFilter) {
        brands(skip: $skip, pageSize: $pageSize, filter: $filter) {
            _id
            name
            entityStatus
        }
        brandCount(filter: $filter)
    }
`;

const GETBRAND = gql`
    query brand($_id: String!) {
        brand(_id: $_id) {
            _id
            name
            entityStatus
        }
    }
`;

export { GETBRANDS, GETBRAND };
