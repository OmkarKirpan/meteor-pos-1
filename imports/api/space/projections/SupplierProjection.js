import { RecordStatus } from "../../../constants";
import events from "../../../domain/Supplier/events";
import pubsub from "../../graphql/pubsub";

const {
    SupplierCreated,
    SupplierUpdated,
    SupplierActivated,
    SupplierInactivated
} = events;

const SupplierProjection = Space.eventSourcing.Projection.extend(
    "SupplierProjection",
    {
        collections: {
            suppliers: "Suppliers"
        },

        eventSubscriptions() {
            return [
                {
                    [SupplierCreated]: this._onSupplierCreated,
                    [SupplierUpdated]: this._onSupplierUpdated,
                    [SupplierActivated]: this._onSupplierActivated,
                    [SupplierInactivated]: this._onSupplierInactivated
                }
            ];
        },

        _onSupplierCreated(event) {
            event.status = RecordStatus.ACTIVE;
            let {
                _id,
                name,
                address,
                phoneNumber,
                createdAt,
                updatedAt,
                status
            } = event;
            this.suppliers.insert({
                _id,
                name,
                address,
                phoneNumber,
                createdAt,
                updatedAt,
                status
            });
            pubsub.publish("SupplierCreated", event);
        },

        _onSupplierUpdated(event) {
            let { _id, name, address, phoneNumber, updatedAt } = event;
            let updatedFields = {
                name,
                address,
                phoneNumber,
                updatedAt
            };
            this.suppliers.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("SupplierUpdated", event);
        },

        _onSupplierActivated(event) {
            event.status = RecordStatus.ACTIVE;
            let { _id, updatedAt, status } = event;
            let updatedFields = { updatedAt, status };
            this.suppliers.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("SupplierActivated", event);
        },

        _onSupplierInactivated(event) {
            event.status = RecordStatus.INACTIVE;
            let { _id, updatedAt, status } = event;
            let updatedFields = { updatedAt, status };
            this.suppliers.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("SupplierInactivated", event);
        }
    }
);

export default SupplierProjection;
