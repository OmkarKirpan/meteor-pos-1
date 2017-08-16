export default `
    input CustomerSearchFilter {
        name: String
    }
    
    input CreateCustomerInput {
        name: String
        address: String
        phoneNumber: String
        cellphoneNumber: String
    }

    input UpdateCustomerInput {
        _id: String
        name: String
        address: String
        phoneNumber: String
        cellphoneNumber: String
    }
`;
