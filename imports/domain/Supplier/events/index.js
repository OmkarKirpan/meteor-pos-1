import SupplierActivated from "./SupplierActivated";
import SupplierCreated from "./SupplierCreated";
import SupplierDeactivated from "./SupplierDeactivated";
import SupplierUpdated from "./SupplierUpdated";

export default Space.messaging.define(Space.domain.Event, {
    SupplierCreated,
    SupplierUpdated,
    SupplierActivated,
    SupplierDeactivated
});
