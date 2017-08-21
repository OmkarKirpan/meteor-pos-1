import { gql } from "react-apollo";

const GETITEMADJUSTMENTS = gql`
    query itemAdjustments(
        $skip: Int!
        $pageSize: Int!
        $filter: ItemAdjustmentSearchFilter
    ) {
        itemAdjustments(skip: $skip, pageSize: $pageSize, filter: $filter) {
            _id
            adjustmentNo
            adjustmentDate
            reason
            adjustmentItems {
                itemId
                quantity
                item {
                    _id
                    name
                    baseUnit
                }
            }
            entityStatus
        }
        itemAdjustmentCount(filter: $filter)
    }
`;

export { GETITEMADJUSTMENTS };
