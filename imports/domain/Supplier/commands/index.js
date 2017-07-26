import CreateSupplier from "./CreateSupplier";
import UpdateSupplier from "./UpdateSupplier";

export default Space.messaging.define(Space.domain.Command, {
    CreateSupplier,
    UpdateSupplier
});
