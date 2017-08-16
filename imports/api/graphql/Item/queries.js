export default `
    type Query {
        items(filter: ItemSearchFilter, skip: Int, pageSize: Int): [Item]
        itemCount(filter: ItemSearchFilter): Int
        item(_id: String!): Item
    }
`;
