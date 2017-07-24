export default `
    type Query {
        inventoryCategories(filter: InventoryCategorySearchFilter, skip: Int, pageSize: Int): [InventoryCategory]
        inventoryCategoryCount(filter: InventoryCategorySearchFilter): Int
        inventoryCategory(_id: String!): InventoryCategory
    }
`;
