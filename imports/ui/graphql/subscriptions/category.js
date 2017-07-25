import { gql } from "react-apollo";

const CATEGORYEVENTSUBSCRIPTION = gql`
    subscription categoryEvent($categoryIds: [String]) {
        categoryEvent(categoryIds: $categoryIds) {
            CategoryCreated {
                _id
                name
                status
            }
            CategoryUpdated {
                _id
                name
            }
            CategoryActivated {
                _id
                status
            }
            CategoryInactivated {
                _id
                status
            }
        }
    }
`;

export { CATEGORYEVENTSUBSCRIPTION };
