import { gql } from "react-apollo";

const CREATEITEM = gql`
    mutation createItem($item: CreateItemInput!) {
        createItem(item: $item)
    }
`;

const UPDATEITEM = gql`
    mutation updateItem($item: UpdateItemInput!) {
        updateItem(item: $item)
    }
`;

const UPDATEITEMSTATUS = gql`
    mutation updateItemStatus($_id: String!, $newStatus: Int!) {
        updateItemStatus(_id: $_id, newStatus: $newStatus)
    }
`;

export { CREATEITEM, UPDATEITEM, UPDATEITEMSTATUS };
