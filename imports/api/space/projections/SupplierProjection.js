import { RecordStatus } from "../../../constants";
import events from "../../../domain/Supplier/events";
import pubsub from "../../graphql/pubsub";

const { SupplierCreated, SupplierUpdated } = events;

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
                    [SupplierUpdated]: this._onSupplierUpdated
                }
            ];
        },

        _onSupplierCreated(event) {
            let {
                _id,
                name,
                address,
                phoneNumber,
                createdAt,
                updatedAt
            } = event;
            this.suppliers.insert({
                _id,
                name,
                address,
                phoneNumber,
                createdAt,
                updatedAt
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
        }
    }
);

export default SupplierProjection;
