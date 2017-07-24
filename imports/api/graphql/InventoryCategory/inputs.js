export default `
    input InventoryCategorySearchFilter {
        name: String
    }
    

    input CreateInventoryCategoryInput {
        name: String
    }

    input UpdateInventoryCategoryInput {
        _id: String
        name: String
    }
`;
