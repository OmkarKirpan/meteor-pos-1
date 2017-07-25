import { gql } from "react-apollo";

const GETINVENTORIES = gql`
    query inventories(
        $skip: Int!
        $pageSize: Int!
        $filter: InventorySearchFilter
    ) {
        inventories(skip: $skip, pageSize: $pageSize, filter: $filter) {
            _id
            categoryId
            category {
                name
            }
            name
            basePrice
            baseUnit
            stock
            prices {
                unit
                price
                multiplier
            }
            status
        }
        inventoryCount(filter: $filter)
    }
`;

const GETINVENTORY = gql`
    query inventory($_id: String!) {
        inventory(_id: $_id) {
            _id
            categoryId
            category {
                name
            }
            name
            basePrice
            baseUnit
            stock
            status
            prices {
                unit
                price
                multiplier
            }
        }
    }
`;

export { GETINVENTORIES, GETINVENTORY };
