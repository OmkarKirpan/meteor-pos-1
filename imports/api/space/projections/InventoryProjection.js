import { RecordStatus } from "../../../constants";
import events from "../../../domain/Inventory/events";
import pubsub from "../../graphql/pubsub";

const {
    InventoryCreated,
    InventoryUpdated,
    InventoryActivated,
    InventoryInactivated
} = events;

const InventoryProjection = Space.eventSourcing.Projection.extend(
    "InventoryProjection",
    {
        collections: {
            inventories: "Inventories"
        },

        eventSubscriptions() {
            return [
                {
                    [InventoryCreated]: this._onInventoryCreated,
                    [InventoryUpdated]: this._onInventoryUpdated,
                    [InventoryActivated]: this._onInventoryActivated,
                    [InventoryInactivated]: this._onInventoryInactivated
                }
            ];
        },

        _onInventoryCreated(event) {
            event.stock = 0;
            event.status = RecordStatus.ACTIVE;
            let {
                _id,
                name,
                basePrice,
                baseUnit,
                prices,
                createdAt,
                updatedAt,
                stock,
                status
            } = event;
            this.inventories.insert({
                _id,
                name,
                stock,
                basePrice,
                baseUnit,
                prices,
                status,
                createdAt,
                updatedAt
            });
            pubsub.publish("InventoryCreated", event);
        },

        _onInventoryUpdated(event) {
            let { _id, name, basePrice, baseUnit, prices, updatedAt } = event;
            let updatedFields = {
                name,
                basePrice,
                baseUnit,
                prices,
                updatedAt
            };
            this.inventories.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("InventoryUpdated", event);
        },

        _onInventoryActivated(event) {
            let { _id, updatedAt } = event;
            let updatedFields = { updatedAt, status: RecordStatus.ACTIVE };
            this.inventories.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("InventoryActivated", event);
        },

        _onInventoryInactivated(event) {
            let { _id, updatedAt } = event;
            let updatedFields = { updatedAt, status: RecordStatus.INACTIVE };
            this.inventories.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("InventoryInactivated", event);
        }
    }
);

export default InventoryProjection;
