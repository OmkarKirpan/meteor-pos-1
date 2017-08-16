import ItemActivated from "./ItemActivated";
import ItemCreated from "./ItemCreated";
import ItemDeactivated from "./ItemDeactivated";
import ItemUpdated from "./ItemUpdated";

export default Space.messaging.define(Space.domain.Event, {
    ItemCreated,
    ItemUpdated,
    ItemActivated,
    ItemDeactivated
});
