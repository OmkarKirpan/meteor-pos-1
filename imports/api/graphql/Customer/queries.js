export default `
    type Query {
        customers(filter: CustomerSearchFilter, skip: Int, pageSize: Int): [Customer]
        customerCount(filter: CustomerSearchFilter): Int
        customer(_id: String!): Customer
    }
`;
