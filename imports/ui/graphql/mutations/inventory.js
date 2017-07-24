import { gql } from "react-apollo";

const CREATEINVENTORY = gql`
    mutation createInventory($inventory: CreateInventoryInput!) {
        createInventory(inventory: $inventory)
    }
`;

const UPDATEINVENTORY = gql`
    mutation updateInventory($inventory: UpdateInventoryInput!) {
        updateInventory(inventory: $inventory)
    }
`;

const UPDATEINVENTORYSTATUS = gql`
    mutation updateInventoryStatus($_id: String!, $newStatus: Int!) {
        updateInventoryStatus(_id: $_id, newStatus: $newStatus)
    }
`;

export { CREATEINVENTORY, UPDATEINVENTORY, UPDATEINVENTORYSTATUS };
