export default `
    type Mutation {
        createSupplier(supplier: CreateSupplierInput): String
        updateSupplier(supplier: UpdateSupplierInput): String
        updateSupplierStatus(_id: String, newStatus: Int): String
    }
`;
