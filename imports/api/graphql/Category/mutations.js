export default `
    type Mutation {
        createCategory(category: CreateCategoryInput): String
        updateCategory(category: UpdateCategoryInput): String
        updateCategoryStatus(_id: String, newStatus: Int): String
    }
`;
