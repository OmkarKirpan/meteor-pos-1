export default `
    input CategorySearchFilter {
        name: String
    }
    
    input CreateCategoryInput {
        name: String
    }

    input UpdateCategoryInput {
        _id: String
        name: String
    }
`;
