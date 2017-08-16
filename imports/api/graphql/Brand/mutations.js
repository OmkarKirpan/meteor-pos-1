export default `
    type Mutation {
        createBrand(brand: CreateBrandInput): String
        updateBrand(brand: UpdateBrandInput): String
        updateBrandStatus(_id: String, newStatus: Int): String
    }
`;
