export default `
    input SupplierSearchFilter {
        name: String
    }
    
    input CreateSupplierInput {
        name: String
        address: String
        phoneNumber: String
    }

    input UpdateSupplierInput {
        _id: String
        name: String
        address: String
        phoneNumber: String
    }
`;
