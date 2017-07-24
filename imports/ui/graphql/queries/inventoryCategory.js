import { gql } from "react-apollo";

const GETINVENTORYCATEGORIES = gql`
    query inventoryCategories(
        $skip: Int!
        $pageSize: Int!
        $filter: InventoryCategorySearchFilter
    ) {
        inventoryCategories(limit: $limit, sort: $sort, filter: $filter) {
            _id
            name
        }
    }
`;

export { GETINVENTORYCATEGORIES };
