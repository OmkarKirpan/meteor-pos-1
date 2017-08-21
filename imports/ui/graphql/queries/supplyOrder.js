import { gql } from "react-apollo";

const GETSUPPLYORDERS = gql`
    query supplyOrders(
        $skip: Int!
        $pageSize: Int!
        $filter: SupplyOrderSearchFilter
    ) {
        supplyOrders(skip: $skip, pageSize: $pageSize, filter: $filter) {
            _id
            supplierId
            orderNo
            orderDate
            discount
            supplyItems {
                itemId
                quantity
                price
                item {
                    _id
                    name
                    baseUnit
                }
            }
            entityStatus
        }
        supplyOrderCount(filter: $filter)
    }
`;

export { GETSUPPLYORDERS };
