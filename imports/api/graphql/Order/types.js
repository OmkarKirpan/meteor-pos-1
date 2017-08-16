export default `
    type ShipmentInfo {
        address: String
        phoneNumber: String
        cellphoneNumber: String
    }

    type OrderItemPrice {
        unit: String
        multiplier: Int
        quantity: Int
        price: Float
        discount: Float
    }
    
    type OrderItem {
        itemId: String
        itemPrices: [OrderItemPrice]
        discount: Float
        item: Item
    }

    type Order {
        _id: String,
        orderNo: String,
        orderDate: Date,
        customerId: String,
        shipmentInfo: ShipmentInfo,
        orderItems: [OrderItem],
        entityStatus: Int,
        orderStatus: Int,
        paidAmount: Float,
        paymentStatus: Int,
        customer: Customer
    }

    type OrderEvent {
        OrderCreated: Order
        OrderUpdated: Order
        OrderCancelled: String
        OrderFinalized: String
        OrderCompleted: String
    }
`;
