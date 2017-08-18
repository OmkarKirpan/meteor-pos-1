import { gql } from "react-apollo";

const CREATEUSER = gql`
    mutation createUser($user: CreateUserInput!) {
        createUser(user: $user)
    }
`;

export { CREATEUSER };
