export default `
    type Subscription {
        inventoryEvent(inventoryIds: [String]): InventoryEvent
    }
`;
