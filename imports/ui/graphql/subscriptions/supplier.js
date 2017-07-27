import { gql } from "react-apollo";

const SUPPLIEREVENTSUBSCRIPTION = gql`
    subscription supplierEvent($supplierIds: [String]) {
        supplierEvent(supplierIds: $supplierIds) {
            SupplierCreated {
                _id
                name
                address
                phoneNumber
            }
            SupplierUpdated {
                _id
                name
                address
                phoneNumber
            }
        }
    }
`;

export { SUPPLIEREVENTSUBSCRIPTION };
