import { gql } from "react-apollo";

const GETITEMS = gql`
    query items($skip: Int!, $pageSize: Int!, $filter: ItemSearchFilter) {
        items(skip: $skip, pageSize: $pageSize, filter: $filter) {
            _id
            brandId
            brand {
                _id
                name
            }
            categoryId
            category {
                _id
                name
            }
            name
            basePrice
            baseUnit
            stock
            itemPrices {
                unit
                price
                multiplier
            }
            allPrices {
                unit
                price
                multiplier
            }
            entityStatus
        }
        itemCount(filter: $filter)
    }
`;

const GETITEM = gql`
    query item($_id: String!) {
        item(_id: $_id) {
            _id
            brandId
            brand {
                _id
                name
            }
            categoryId
            category {
                _id
                name
            }
            name
            basePrice
            baseUnit
            stock
            entityStatus
            itemPrices {
                unit
                price
                multiplier
            }
        }
    }
`;

export { GETITEMS, GETITEM };
