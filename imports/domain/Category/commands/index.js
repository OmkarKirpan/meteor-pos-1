import ActivateCategory from "./ActivateCategory";
import CreateCategory from "./CreateCategory";
import InactivateCategory from "./InactivateCategory";
import UpdateCategory from "./UpdateCategory";

export default Space.messaging.define(Space.domain.Command, {
    CreateCategory,
    UpdateCategory,
    ActivateCategory,
    InactivateCategory
});
