import { gql } from "react-apollo";

const INVENTORYCATEGORYEVENTSUBSCRIPTION = gql`
    subscription inventoryCategoryEvent($inventoryCategoryIds: [String]) {
        inventoryCategoryEvent(inventoryCategoryIds: $inventoryCategoryIds) {
            InventoryCategoryCreated {
                _id
                name
                status
            }
            InventoryCategoryUpdated {
                _id
                name
            }
            InventoryCategoryActivated {
                _id
                status
            }
            InventoryCategoryInactivated {
                _id
                status
            }
        }
    }
`;

export { INVENTORYCATEGORYEVENTSUBSCRIPTION };
