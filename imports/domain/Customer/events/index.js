import CustomerActivated from "./CustomerActivated";
import CustomerCreated from "./CustomerCreated";
import CustomerInactivated from "./CustomerInactivated";
import CustomerUpdated from "./CustomerUpdated";

export default Space.messaging.define(Space.domain.Event, {
    CustomerCreated,
    CustomerUpdated,
    CustomerActivated,
    CustomerInactivated
});
