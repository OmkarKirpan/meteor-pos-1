import CategoryActivated from "./CategoryActivated";
import CategoryCreated from "./CategoryCreated";
import CategoryInactivated from "./CategoryInactivated";
import CategoryUpdated from "./CategoryUpdated";

export default Space.messaging.define(Space.domain.Event, {
    CategoryCreated,
    CategoryUpdated,
    CategoryActivated,
    CategoryInactivated
});
