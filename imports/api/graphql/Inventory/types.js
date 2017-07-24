export default `
    type InventoryPrice {
        unit: String
        price: Float
        multiplier: Int
    }

    type Inventory {
        _id: String
        name: String
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
    }
`;
