import InventoryActivated from "./InventoryActivated";
import InventoryCreated from "./InventoryCreated";
import InventoryInactivated from "./InventoryInactivated";
import InventoryUpdated from "./InventoryUpdated";

export default Space.messaging.define(Space.domain.Event, {
    InventoryCreated,
    InventoryUpdated,
    InventoryActivated,
    InventoryInactivated
});
