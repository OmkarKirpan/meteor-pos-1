export default `
    type Subscription {
        customerEvent(customerIds: [String]): CustomerEvent
    }
`;
