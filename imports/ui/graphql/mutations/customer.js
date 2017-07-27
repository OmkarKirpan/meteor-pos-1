import { gql } from "react-apollo";

const CREATECUSTOMER = gql`
    mutation createCustomer($customer: CreateCustomerInput!) {
        createCustomer(customer: $customer)
    }
`;

const UPDATECUSTOMER = gql`
    mutation updateCustomer($customer: UpdateCustomerInput!) {
        updateCustomer(customer: $customer)
    }
`;
const UPDATECUSTOMERSTATUS = gql`
    mutation updateCustomerStatus($_id: String!, $newStatus: Int!) {
        updateCustomerStatus(_id: $_id, newStatus: $newStatus)
    }
`;
export { CREATECUSTOMER, UPDATECUSTOMER, UPDATECUSTOMERSTATUS };
