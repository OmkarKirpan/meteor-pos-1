export default `
    type Brand {
        _id: String
        name: String
        entityStatus: Int
    }

    type BrandEvent {
        BrandCreated: Brand
        BrandUpdated: Brand
    }
`;
