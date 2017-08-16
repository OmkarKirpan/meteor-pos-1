import { gql } from "react-apollo";

const CATEGORYEVENTSUBSCRIPTION = gql`
    subscription categoryEvent($categoryIds: [String]) {
        categoryEvent(categoryIds: $categoryIds) {
            CategoryCreated {
                _id
            }
            CategoryUpdated {
                _id
                name
            }
            CategoryActivated {
                _id
                entityStatus
            }
            CategoryDeactivated {
                _id
                entityStatus
            }
        }
    }
`;

export { CATEGORYEVENTSUBSCRIPTION };
