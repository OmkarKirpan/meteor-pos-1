import CustomerActivated from "./CustomerActivated";
import CustomerCreated from "./CustomerCreated";
import CustomerDeactivated from "./CustomerDeactivated";
import CustomerUpdated from "./CustomerUpdated";

export default Space.messaging.define(Space.domain.Event, {
    CustomerCreated,
    CustomerUpdated,
    CustomerActivated,
    CustomerDeactivated
});
