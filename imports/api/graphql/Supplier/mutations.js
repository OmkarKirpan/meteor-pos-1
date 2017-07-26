export default `
    type Mutation {
        createSupplier(inventory: CreateSupplierInput): String
        updateSupplier(inventory: UpdateSupplierInput): String
    }
`;
