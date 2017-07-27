import ActivateSupplier from "./ActivateSupplier";
import CreateSupplier from "./CreateSupplier";
import InactivateSupplier from "./InactivateSupplier";
import UpdateSupplier from "./UpdateSupplier";

export default Space.messaging.define(Space.domain.Command, {
    CreateSupplier,
    UpdateSupplier,
    ActivateSupplier,
    InactivateSupplier
});
