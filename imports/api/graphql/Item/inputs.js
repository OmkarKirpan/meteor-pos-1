export default `
    input ItemSearchFilter {
        name: String
        entityStatus: Int
    }
    
    input ItemPriceInput {
        unit: String
        price: Float
        multiplier: Int
    }

    input CreateItemInput {
        name: String
        brandId: String
        categoryId: String
        basePrice: Float
        baseUnit: String
        itemPrices: [ItemPriceInput]
    }

    input UpdateItemInput {
        _id: String
        name: String
        brandId: String
        categoryId: String
        basePrice: Float
        baseUnit: String
        itemPrices: [ItemPriceInput]
    }
`;
