export default `
    type Mutation {
        createInventoryCategory(inventory: CreateInventoryCategoryInput): String
        updateInventoryCategory(inventory: UpdateInventoryCategoryInput): String
        updateInventoryCategoryStatus(_id: String, newStatus: Int): String
    }
`;
