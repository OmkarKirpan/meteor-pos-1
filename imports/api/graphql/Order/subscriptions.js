export default `
    type Subscription {
        orderEvent(orderIds: [String]): OrderEvent
    }
`;
