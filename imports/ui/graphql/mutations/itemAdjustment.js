import { gql } from "react-apollo";

const CREATEITEMADJUSTMENT = gql`
    mutation createItemAdjustment($itemAdjustment: CreateItemAdjustmentInput!) {
        createItemAdjustment(itemAdjustment: $itemAdjustment)
    }
`;

export { CREATEITEMADJUSTMENT };
