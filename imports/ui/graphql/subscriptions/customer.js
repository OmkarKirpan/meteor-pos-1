import { gql } from "react-apollo";

const CUSTOMEREVENTSUBSCRIPTION = gql`
    subscription customerEvent($customerIds: [String]) {
        customerEvent(customerIds: $customerIds) {
            CustomerCreated {
                _id
            }
            CustomerUpdated {
                _id
                name
                address
                phoneNumber
                cellphoneNumber
            }
            CustomerActivated {
                _id
                entityStatus
            }
            CustomerDeactivated {
                _id
                entityStatus
            }
        }
    }
`;

export { CUSTOMEREVENTSUBSCRIPTION };
