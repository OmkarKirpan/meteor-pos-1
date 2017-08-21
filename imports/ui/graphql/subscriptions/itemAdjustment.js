import { gql } from "react-apollo";

const ITEMADJUSTMENTEVENTSUBSCRIPTION = gql`
    subscription itemAdjustmentEvent {
        itemAdjustmentEvent {
            ItemAdjustmentCreated {
                _id
            }
        }
    }
`;

export { ITEMADJUSTMENTEVENTSUBSCRIPTION };
