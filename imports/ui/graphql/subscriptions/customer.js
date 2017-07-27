import { gql } from "react-apollo";

const CUSTOMEREVENTSUBSCRIPTION = gql`
    subscription customerEvent($customerIds: [String]) {
        customerEvent(customerIds: $customerIds) {
            CustomerCreated {
                _id
                name
                address
                phoneNumber
            }
            CustomerUpdated {
                _id
                name
                address
                phoneNumber
            }
            CustomerActivated {
                _id
                status
            }
            CustomerInactivated {
                _id
                status
            }
        }
    }
`;

export { CUSTOMEREVENTSUBSCRIPTION };
