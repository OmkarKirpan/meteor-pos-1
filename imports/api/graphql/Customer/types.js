export default `
    type Customer {
        _id: String
        name: String
        address: String
        phoneNumber: String
        cellphoneNumber: String
        entityStatus: Int
    }

    type CustomerEvent {
        CustomerCreated: Customer
        CustomerUpdated: Customer
        CustomerActivated: Customer
        CustomerDeactivated: Customer
    }
`;
