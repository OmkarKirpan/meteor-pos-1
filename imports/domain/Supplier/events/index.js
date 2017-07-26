import SupplierCreated from "./SupplierCreated";
import SupplierUpdated from "./SupplierUpdated";

export default Space.messaging.define(Space.domain.Event, {
    SupplierCreated,
    SupplierUpdated
});
