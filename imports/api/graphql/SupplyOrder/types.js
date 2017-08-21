export default `
type SupplyOrderItem {
    itemId: String
    price: Float
    quantity: Int
    item: Item
}

type SupplyOrder {
    _id: String
    supplierId: String
    orderNo: String
    orderDate: Date
    supplyItems: [SupplyOrderItem]
    discount: String
    entityStatus: Int
    createdAt: Date
    updatedAt: Date
}

type SupplyOrderEvent {
    SupplyOrderCreated: SupplyOrder
}
`;
