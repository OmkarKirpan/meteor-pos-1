import { gql } from "react-apollo";

const BRANDEVENTSUBSCRIPTION = gql`
    subscription brandEvent($brandIds: [String]) {
        brandEvent(brandIds: $brandIds) {
            BrandCreated {
                _id
            }
            BrandUpdated {
                _id
                name
            }
        }
    }
`;

export { BRANDEVENTSUBSCRIPTION };
