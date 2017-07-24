export default `
    type Query {
        inventories(filter: InventorySearchFilter, skip: Int, pageSize: Int): [Inventory]
        inventoryCount(filter: InventorySearchFilter): Int
        inventory(_id: String!): Inventory
    }
`;
