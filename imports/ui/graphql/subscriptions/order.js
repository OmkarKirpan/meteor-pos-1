import { gql } from "react-apollo";

const ORDEREVENTSUBSCRIPTION = gql`
    subscription orderEvent($orderIds: [String]) {
        orderEvent(orderIds: $orderIds) {
            OrderCreated {
                _id
            }
            OrderUpdated {
                _id
                shipmentInfo {
                    address
                    phoneNumber
                    cellphoneNumber
                }
                orderItems {
                    itemId
                    discount
                    itemPrices {
                        unit
                        multiplier
                        quantity
                        price
                        discount
                    }
                }
            }
            OrderCancelled
            OrderFinalized
            OrderCompleted
        }
    }
`;

export { ORDEREVENTSUBSCRIPTION };
