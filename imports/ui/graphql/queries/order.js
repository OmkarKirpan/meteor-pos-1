import { gql } from "react-apollo";

const GETORDERS = gql`
    query orders($skip: Int!, $pageSize: Int!, $filter: OrderSearchFilter) {
        orders(skip: $skip, pageSize: $pageSize, filter: $filter) {
            _id
            orderNo
            orderDate
            customerId
            customer {
                _id
                name
            }
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
            orderStatus
            paidAmount
            paymentStatus
            entityStatus
        }
        orderCount(filter: $filter)
    }
`;

const GETORDER = gql`
    query order($_id: String!) {
        order(_id: $_id) {
            _id
            orderNo
            orderDate
            customerId
            customer {
                _id
                name
                address
                phoneNumber
                cellphoneNumber
            }
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
                item {
                    _id
                    name
                    allPrices {
                        unit
                        price
                        multiplier
                    }
                }
            }
            orderStatus
            paidAmount
            paymentStatus
            entityStatus
        }
    }
`;

export { GETORDERS, GETORDER };
