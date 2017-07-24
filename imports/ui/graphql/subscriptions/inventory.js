import { gql } from "react-apollo";

const INVENTORYEVENTSUBSCRIPTION = gql`
    subscription inventoryEvent($inventoryIds: [String]) {
        inventoryEvent(inventoryIds: $inventoryIds) {
            InventoryCreated {
                _id
                name
                basePrice
                baseUnit
                stock
                prices {
                    unit
                    price
                    multiplier
                }
                status
            }
            InventoryUpdated {
                _id
                name
                basePrice
                baseUnit
                prices {
                    unit
                    price
                    multiplier
                }
            }
            InventoryActivated {
                _id
                status
            }
            InventoryInactivated {
                _id
                status
            }
        }
    }
`;

export { INVENTORYEVENTSUBSCRIPTION };
