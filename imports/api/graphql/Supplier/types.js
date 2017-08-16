export default `
    type Supplier {
        _id: String
        name: String
        address: String
        phoneNumber: String
        cellphoneNumber: String
        entityStatus: Int
    }

    type SupplierEvent {
        SupplierCreated: Supplier
        SupplierUpdated: Supplier
        SupplierActivated: Supplier
        SupplierDeactivated: Supplier
    }
`;
