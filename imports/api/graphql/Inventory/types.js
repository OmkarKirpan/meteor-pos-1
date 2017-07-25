export default `
    type InventoryPrice {
        unit: String
        price: Float
        multiplier: Int
    }

    type InventoryCategory {
        name: String
        status: Int
    }

    type Inventory {
        _id: String
        name: String
        categoryId: String
        category: InventoryCategory
        basePrice: Float
        baseUnit: String
        stock: Int
        prices: [InventoryPrice]
        status: Int
    }

    type InventoryEvent {
        InventoryCreated: Inventory
        InventoryUpdated: Inventory
        InventoryActivated: Inventory
        InventoryInactivated: Inventory
        CategoryStatusChanged: InventoryCategory
    }
`;
