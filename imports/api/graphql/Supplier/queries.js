export default `
    type Query {
        suppliers(filter: SupplierSearchFilter, skip: Int, pageSize: Int): [Supplier]
        supplierCount(filter: SupplierSearchFilter): Int
        supplier(_id: String!): Supplier
    }
`;
