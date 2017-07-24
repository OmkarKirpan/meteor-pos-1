export default `
    type Subscription {
        inventoryCategoryEvent(inventoryCategoryIds: [String]): InventoryCategoryEvent
    }
`;
