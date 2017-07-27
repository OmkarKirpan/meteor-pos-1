export default `
    type Supplier {
        _id: String
        name: String
        address: String
        phoneNumber: String
        status: Int
    }

    type SupplierEvent {
        SupplierCreated: Supplier
        SupplierUpdated: Supplier
        SupplierActivated: Supplier
        SupplierInactivated: Supplier
    }
`;
