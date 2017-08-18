export default `
    input BrandSearchFilter {
        name: String
        entityStatus: Int
    }
    
    input CreateBrandInput {
        name: String
    }

    input UpdateBrandInput {
        _id: String
        name: String
    }
`;
