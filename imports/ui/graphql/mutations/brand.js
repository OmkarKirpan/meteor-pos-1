import { gql } from "react-apollo";

const CREATEBRAND = gql`
    mutation createBrand($brand: CreateBrandInput!) {
        createBrand(brand: $brand)
    }
`;

const UPDATEBRAND = gql`
    mutation updateBrand($brand: UpdateBrandInput!) {
        updateBrand(brand: $brand)
    }
`;

export { CREATEBRAND, UPDATEBRAND };
