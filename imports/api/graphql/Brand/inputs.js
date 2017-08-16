export default `
    input BrandSearchFilter {
        name: String
    }
    
    input CreateBrandInput {
        name: String
    }

    input UpdateBrandInput {
        _id: String
        name: String
    }
`;
