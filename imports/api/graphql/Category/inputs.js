export default `
    input CategorySearchFilter {
        name: String
        entityStatus: Int
    }
    
    input CreateCategoryInput {
        name: String
    }

    input UpdateCategoryInput {
        _id: String
        name: String
    }
`;
