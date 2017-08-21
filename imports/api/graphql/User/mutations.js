export default `
type Mutation {
    createUser(user: CreateUserInput): String
    changePassword(newPassword: String): String
}
`;
