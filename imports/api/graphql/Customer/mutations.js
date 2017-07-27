export default `
    type Mutation {
        createCustomer(customer: CreateCustomerInput): String
        updateCustomer(customer: UpdateCustomerInput): String
        updateCustomerStatus(_id: String, newStatus: Int): String
    }
`;
