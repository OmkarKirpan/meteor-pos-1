import ActivateInventoryCategory from "./ActivateInventoryCategory";
import CreateInventoryCategory from "./CreateInventoryCategory";
import InactivateInventoryCategory from "./InactivateInventoryCategory";
import UpdateInventoryCategory from "./UpdateInventoryCategory";

export default Space.messaging.define(Space.domain.Command, {
    CreateInventoryCategory,
    UpdateInventoryCategory,
    ActivateInventoryCategory,
    InactivateInventoryCategory
});
