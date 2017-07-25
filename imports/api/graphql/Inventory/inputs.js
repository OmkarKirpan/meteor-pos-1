export default `
    input InventorySearchFilter {
        name: String
    }
    
    input InventoryPriceInput {
        unit: String
        price: Float
        multiplier: Int
    }

    input CreateInventoryInput {
        name: String
        categoryId: String
        basePrice: Float
        baseUnit: String
        prices: [InventoryPriceInput]
    }

    input UpdateInventoryInput {
        _id: String
        name: String
        categoryId: String
        basePrice: Float
        baseUnit: String
        prices: [InventoryPriceInput]
    }
`;
