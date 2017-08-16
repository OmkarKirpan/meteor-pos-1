import CategoryActivated from "./CategoryActivated";
import CategoryCreated from "./CategoryCreated";
import CategoryDeactivated from "./CategoryDeactivated";
import CategoryUpdated from "./CategoryUpdated";

export default Space.messaging.define(Space.domain.Event, {
    CategoryCreated,
    CategoryUpdated,
    CategoryActivated,
    CategoryDeactivated
});
