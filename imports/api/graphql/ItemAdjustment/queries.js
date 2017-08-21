export default `
    type Query {
        itemAdjustments(filter: ItemAdjustmentSearchFilter, skip: Int, pageSize: Int): [ItemAdjustment]
        itemAdjustmentCount(filter: ItemAdjustmentSearchFilter): Int
        itemAdjustment(_id: String!): ItemAdjustment
    }
`;
