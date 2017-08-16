export default `
    type Mutation {
        createOrder(order: CreateOrderInput): String
        updateOrder(order: UpdateOrderInput): String
        cancelOrder(_id: String!): String
        finalizeOrder(_id: String!): String
        completeOrder(_id: String!): String
        printOrder(_id: String): String
    }
`;
