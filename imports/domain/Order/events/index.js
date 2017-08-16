import OrderCancelled from "./OrderCancelled";
import OrderCompleted from "./OrderCompleted";
import OrderCreated from "./OrderCreated";
import OrderFinalized from "./OrderFinalized";
import OrderUpdated from "./OrderUpdated";

export default Space.messaging.define(Space.domain.Event, {
    OrderCancelled,
    OrderCreated,
    OrderFinalized,
    OrderCompleted,
    OrderUpdated
});
