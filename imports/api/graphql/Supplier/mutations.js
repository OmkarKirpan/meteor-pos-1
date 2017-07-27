export default `
    type Mutation {
        createSupplier(supplier: CreateSupplierInput): String
        updateSupplier(supplier: UpdateSupplierInput): String
    }
`;
