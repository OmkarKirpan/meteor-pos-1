import { gql } from "react-apollo";

const CREATECATEGORY = gql`
    mutation createCategory($category: CreateCategoryInput!) {
        createCategory(category: $category)
    }
`;

const UPDATECATEGORY = gql`
    mutation updateCategory($category: UpdateCategoryInput!) {
        updateCategory(category: $category)
    }
`;

const UPDATECATEGORYSTATUS = gql`
    mutation updateCategoryStatus($_id: String!, $newStatus: Int!) {
        updateCategoryStatus(_id: $_id, newStatus: $newStatus)
    }
`;

export { CREATECATEGORY, UPDATECATEGORY, UPDATECATEGORYSTATUS };
