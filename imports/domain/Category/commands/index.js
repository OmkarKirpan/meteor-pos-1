import ActivateCategory from "./ActivateCategory";
import CreateCategory from "./CreateCategory";
import DeactivateCategory from "./DeactivateCategory";
import UpdateCategory from "./UpdateCategory";

export default Space.messaging.define(Space.domain.Command, {
    CreateCategory,
    UpdateCategory,
    ActivateCategory,
    DeactivateCategory
});
