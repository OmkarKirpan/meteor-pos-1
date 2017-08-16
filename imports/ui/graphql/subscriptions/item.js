import { gql } from "react-apollo";

const ITEMEVENTSUBSCRIPTION = gql`
    subscription itemEvent($itemIds: [String]) {
        itemEvent(itemIds: $itemIds) {
            ItemCreated {
                _id
            }
            ItemUpdated {
                _id
                name
                basePrice
                baseUnit
                allPrices {
                    unit
                    price
                    multiplier
                }
                categoryId
                category {
                    _id
                    name
                }
                brandId
                brand {
                    _id
                    name
                }
            }
            ItemActivated {
                _id
                entityStatus
            }
            ItemDeactivated {
                _id
                entityStatus
            }
        }
    }
`;

export { ITEMEVENTSUBSCRIPTION };
