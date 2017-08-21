export default `
type Query {
    supplyOrders(filter: SupplyOrderSearchFilter, skip: Int, pageSize: Int): [SupplyOrder]
    supplyOrderCount(filter: SupplyOrderSearchFilter): Int
    supplyOrder(_id: String!): SupplyOrder
}
`;
