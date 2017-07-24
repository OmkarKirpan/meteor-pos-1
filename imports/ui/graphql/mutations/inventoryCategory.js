import { gql } from "react-apollo";

const CREATEINVENTORYCATEGORY = gql`
    mutation createInventoryCategory(
        $inventoryCategory: CreateInventoryCategoryInput!
    ) {
        createInventoryCategory(inventoryCategory: $inventoryCategory)
    }
`;

const UPDATEINVENTORYCATEGORY = gql`
    mutation updateInventoryCategory(
        $inventoryCategory: UpdateInventoryCategoryInput!
    ) {
        updateInventoryCategory(inventoryCategory: $inventoryCategory)
    }
`;

const UPDATEINVENTORYCATEGORYSTATUS = gql`
    mutation updateInventoryCategoryStatus($_id: String!, $newStatus: Int!) {
        updateInventoryCategoryStatus(_id: $_id, newStatus: $newStatus)
    }
`;

export {
    CREATEINVENTORYCATEGORY,
    UPDATEINVENTORYCATEGORY,
    UPDATEINVENTORYCATEGORYSTATUS
};
