export default `
input SupplyOrderSearchFilter {
    orderDate: Date
}

input SupplyOrderItemInput {
    itemId: String
    price: Float
    quantity: Int
}

input CreateSupplyOrderInput {
    supplierId: String
    orderDate: Date
    supplyItems: [SupplyOrderItemInput]
    discount: Float
}
`;
