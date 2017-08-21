export default `
    input OrderSearchFilter {
        orderStatus: Int
        orderDate: Date
    }
    
    input ShipmentInfoInput {
        address: String
        phoneNumber: String
        cellphoneNumber: String
    }

    input OrderItemPriceInput {
        unit: String
        multiplier: Int
        quantity: Int
        price: Float
        discount: Float
    }

    input OrderItemInput {
        itemId: String
        itemPrices: [OrderItemPriceInput]
        discount: Float
    }

    input CreateOrderInput {
        orderDate: Date,
        customerId: String,
        shipmentInfo: ShipmentInfoInput,
        orderItems: [OrderItemInput]
    }

    input UpdateOrderInput {
        _id: String
        shipmentInfo: ShipmentInfoInput,
        orderItems: [OrderItemInput]
    }
`;
