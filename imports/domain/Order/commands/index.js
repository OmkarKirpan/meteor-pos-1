import CancelOrder from "./CancelOrder";
import CompleteOrder from "./CompleteOrder";
import CreateOrder from "./CreateOrder";
import FinalizeOrder from "./FinalizeOrder";
import UpdateOrder from "./UpdateOrder";

export default Space.messaging.define(Space.domain.Command, {
    CancelOrder,
    CreateOrder,
    FinalizeOrder,
    CompleteOrder,
    UpdateOrder
});
