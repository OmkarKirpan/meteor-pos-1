import ActivateInventory from "./ActivateInventory";
import CreateInventory from "./CreateInventory";
import InactivateInventory from "./InactivateInventory";
import UpdateInventory from "./UpdateInventory";

export default Space.messaging.define(Space.domain.Command, {
    CreateInventory,
    UpdateInventory,
    ActivateInventory,
    InactivateInventory
});
