export default `
    type Mutation {
        createInventory(inventory: CreateInventoryInput): String
        updateInventory(inventory: UpdateInventoryInput): String
        updateInventoryStatus(_id: String, newStatus: Int): String
    }
`;
