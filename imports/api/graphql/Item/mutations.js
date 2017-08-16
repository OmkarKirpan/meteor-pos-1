export default `
    type Mutation {
        createItem(item: CreateItemInput): String
        updateItem(item: UpdateItemInput): String
        updateItemStatus(_id: String, newStatus: Int): String
    }
`;
