export default `
    type InventoryCategory {
        _id: String
        name: String
        status: Int
    }

    type InventoryCategoryEvent {
        InventoryCategoryCreated: InventoryCategory
        InventoryCategoryUpdated: InventoryCategory
        InventoryCategoryActivated: InventoryCategory
        InventoryCategoryInactivated: InventoryCategory
    }
`;
