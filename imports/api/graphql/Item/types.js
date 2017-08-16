export default `
    type ItemPrice {
        unit: String
        price: Float
        multiplier: Int
    }

    type Item {
        _id: String
        name: String
        brandId: String
        brand: Brand
        categoryId: String
        category: Category
        basePrice: Float
        baseUnit: String
        stock: Int
        itemPrices: [ItemPrice]
        allPrices: [ItemPrice]
        entityStatus: Int
    }

    type ItemEvent {
        ItemCreated: Item
        ItemUpdated: Item
        ItemActivated: Item
        ItemDeactivated: Item
    }
`;
