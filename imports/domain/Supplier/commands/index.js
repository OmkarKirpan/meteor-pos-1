import ActivateSupplier from "./ActivateSupplier";
import CreateSupplier from "./CreateSupplier";
import DeactivateSupplier from "./DeactivateSupplier";
import UpdateSupplier from "./UpdateSupplier";

export default Space.messaging.define(Space.domain.Command, {
    CreateSupplier,
    UpdateSupplier,
    ActivateSupplier,
    DeactivateSupplier
});
