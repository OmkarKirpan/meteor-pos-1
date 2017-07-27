import SupplierActivated from "./SupplierActivated";
import SupplierCreated from "./SupplierCreated";
import SupplierInactivated from "./SupplierInactivated";
import SupplierUpdated from "./SupplierUpdated";

export default Space.messaging.define(Space.domain.Event, {
    SupplierCreated,
    SupplierUpdated,
    SupplierActivated,
    SupplierInactivated
});
