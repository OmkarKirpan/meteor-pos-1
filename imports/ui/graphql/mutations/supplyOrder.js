import { gql } from "react-apollo";

const CREATESUPPLYORDER = gql`
    mutation createSupplyOrder($supplyOrder: CreateSupplyOrderInput!) {
        createSupplyOrder(supplyOrder: $supplyOrder)
    }
`;

export { CREATESUPPLYORDER };
