export default `
    type Query {
        categories(filter: CategorySearchFilter, skip: Int, pageSize: Int): [Category]
        categoryCount(filter: CategorySearchFilter): Int
        category(_id: String!): Category
    }
`;
