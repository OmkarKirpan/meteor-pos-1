import { gql } from "react-apollo";

const SUPPLIEREVENTSUBSCRIPTION = gql`
    subscription supplierEvent($supplierIds: [String]) {
        supplierEvent(supplierIds: $supplierIds) {
            SupplierCreated {
                _id
            }
            SupplierUpdated {
                _id
                name
                address
                phoneNumber
                cellphoneNumber
            }
            SupplierActivated {
                _id
                entityStatus
            }
            SupplierDeactivated {
                _id
                entityStatus
            }
        }
    }
`;

export { SUPPLIEREVENTSUBSCRIPTION };
