export default `
    type Customer {
        _id: String
        name: String
        address: String
        phoneNumber: String
        status: Int
    }

    type CustomerEvent {
        CustomerCreated: Customer
        CustomerUpdated: Customer
        CustomerActivated: Customer
        CustomerInactivated: Customer
    }
`;
