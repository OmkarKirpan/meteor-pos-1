export default `
type Query {
    users(filter: UserSearchFilter, skip: Int, pageSize: Int): [User]
    userCount(filter: UserSearchFilter): Int
}
`;
