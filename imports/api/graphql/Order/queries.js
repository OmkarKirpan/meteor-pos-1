export default `
    type Query {
        orders(filter: OrderSearchFilter, skip: Int, pageSize: Int): [Order]
        orderCount(filter: OrderSearchFilter): Int
        order(_id: String!): Order
    }
`;
