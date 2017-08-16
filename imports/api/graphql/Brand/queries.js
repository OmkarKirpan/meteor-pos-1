export default `
    type Query {
        brands(filter: BrandSearchFilter, skip: Int, pageSize: Int): [Brand]
        brandCount(filter: BrandSearchFilter): Int
        brand(_id: String!): Brand
    }
`;
