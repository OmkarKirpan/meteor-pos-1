import ActivateItem from "./ActivateItem";
import CreateItem from "./CreateItem";
import DeactivateItem from "./DeactivateItem";
import UpdateItem from "./UpdateItem";

export default Space.messaging.define(Space.domain.Command, {
    CreateItem,
    UpdateItem,
    ActivateItem,
    DeactivateItem
});
