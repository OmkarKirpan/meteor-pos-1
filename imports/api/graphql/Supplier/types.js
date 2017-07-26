export default `
    type Supplier {
        _id: String
        name: String
        address: String
        phoneNumber: String
    }

    type SupplierEvent {
        SupplierCreated: Supplier
        SupplierUpdated: Supplier
    }
`;
