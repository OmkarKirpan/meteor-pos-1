import ActivateCustomer from "./ActivateCustomer";
import CreateCustomer from "./CreateCustomer";
import DeactivateCustomer from "./DeactivateCustomer";
import UpdateCustomer from "./UpdateCustomer";

export default Space.messaging.define(Space.domain.Command, {
    CreateCustomer,
    UpdateCustomer,
    ActivateCustomer,
    DeactivateCustomer
});
