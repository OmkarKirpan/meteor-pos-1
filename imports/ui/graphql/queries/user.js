import { gql } from "react-apollo";

const GETUSERS = gql`
    query suppliers($skip: Int!, $pageSize: Int!, $filter: UserSearchFilter) {
        users(skip: $skip, pageSize: $pageSize, filter: $filter) {
            username
            createdAt
        }
        userCount(filter: $filter)
    }
`;

export { GETUSERS };
