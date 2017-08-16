import { gql } from "react-apollo";

const CREATEORDER = gql`
    mutation createOrder($order: CreateOrderInput!) {
        createOrder(order: $order)
    }
`;

const UPDATEORDER = gql`
    mutation updateOrder($order: UpdateOrderInput!) {
        updateOrder(order: $order)
    }
`;

const CANCELORDER = gql`
    mutation cancelOrder($_id: String!) {
        cancelOrder(_id: $_id)
    }
`;

const FINALIZEORDER = gql`
    mutation finalizeOrder($_id: String!) {
        finalizeOrder(_id: $_id)
    }
`;

const COMPLETEORDER = gql`
    mutation completeOrder($_id: String!) {
        completeOrder(_id: $_id)
    }
`;

const PRINTORDER = gql`
    mutation printOrder($_id: String!) {
        printOrder(_id: $_id)
    }
`;

export {
    CREATEORDER,
    UPDATEORDER,
    CANCELORDER,
    FINALIZEORDER,
    COMPLETEORDER,
    PRINTORDER
};
