import { gql } from "react-apollo";

const SUPPLYORDEREVENTSUBSCRIPTION = gql`
    subscription supplyOrderEvent {
        supplyOrderEvent {
            SupplyOrderCreated {
                _id
            }
        }
    }
`;

export { SUPPLYORDEREVENTSUBSCRIPTION };
