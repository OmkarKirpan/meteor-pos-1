import { ENTITYSTATUS } from "../../../constants";
import events from "../../../domain/Supplier/events";
import pubsub from "../../graphql/pubsub";

const {
    SupplierCreated,
    SupplierUpdated,
    SupplierActivated,
    SupplierDeactivated
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
                    [SupplierDeactivated]: this._onSupplierDeactivated
                }
            ];
        },

        _onSupplierCreated(event) {
            event.entityStatus = ENTITYSTATUS.ACTIVE;
            const {
                _id,
                name,
                address,
                phoneNumber,
                cellphoneNumber,

                createdAt,
                updatedAt,
                entityStatus
            } = event;
            this.suppliers.insert({
                _id,
                name,
                address,
                phoneNumber,
                cellphoneNumber,

                createdAt,
                updatedAt,
                entityStatus
            });
            pubsub.publish("SupplierCreated", event);
        },

        _onSupplierUpdated(event) {
            const {
                _id,
                name,
                address,
                phoneNumber,
                cellphoneNumber,
                updatedAt
            } = event;
            const updatedFields = {
                name,
                address,
                phoneNumber,
                cellphoneNumber,

                updatedAt
            };
            this.suppliers.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("SupplierUpdated", event);
        },

        _onSupplierActivated(event) {
            event.entityStatus = ENTITYSTATUS.ACTIVE;
            const { _id, updatedAt, entityStatus } = event;
            const updatedFields = { updatedAt, entityStatus };
            this.suppliers.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("SupplierActivated", event);
        },

        _onSupplierDeactivated(event) {
            event.entityStatus = ENTITYSTATUS.INACTIVE;
            const { _id, updatedAt, entityStatus } = event;
            const updatedFields = { updatedAt, entityStatus };
            this.suppliers.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("SupplierDeactivated", event);
        }
    }
);

export default SupplierProjection;
