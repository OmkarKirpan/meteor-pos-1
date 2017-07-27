import ActivateCustomer from "./ActivateCustomer";
import CreateCustomer from "./CreateCustomer";
import InactivateCustomer from "./InactivateCustomer";
import UpdateCustomer from "./UpdateCustomer";

export default Space.messaging.define(Space.domain.Command, {
    CreateCustomer,
    UpdateCustomer,
    ActivateCustomer,
    InactivateCustomer
});
