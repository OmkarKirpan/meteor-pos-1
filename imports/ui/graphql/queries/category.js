import { gql } from "react-apollo";

const GETCATEGORIES = gql`
    query categories(
        $skip: Int!
        $pageSize: Int!
        $filter: CategorySearchFilter
    ) {
        categories(skip: $skip, pageSize: $pageSize, filter: $filter) {
            _id
            name
            entityStatus
        }
        categoryCount(filter: $filter)
    }
`;

const GETCATEGORY = gql`
    query category($_id: String!) {
        category(_id: $_id) {
            _id
            name
            entityStatus
        }
    }
`;

export { GETCATEGORIES, GETCATEGORY };
