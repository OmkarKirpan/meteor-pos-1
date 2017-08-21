import { gql } from "react-apollo";

const CREATEUSER = gql`
    mutation createUser($user: CreateUserInput!) {
        createUser(user: $user)
    }
`;

const CHANGEPASSWORD = gql`
    mutation changePassword($newPassword: String) {
        changePassword(newPassword: $newPassword)
    }
`;

export { CREATEUSER, CHANGEPASSWORD };
