import { RecordStatus } from "../../../constants";
import events from "../../../domain/InventoryCategory/events";
import pubsub from "../../graphql/pubsub";

const {
    InventoryCategoryCreated,
    InventoryCategoryUpdated,
    InventoryCategoryActivated,
    InventoryCategoryInactivated
} = events;

const InventoryCategoryProjection = Space.eventSourcing.Projection.extend(
    "InventoryCategoryProjection",
    {
        collections: {
            inventoryCategories: "InventoryCategories"
        },

        eventSubscriptions() {
            return [
                {
                    [InventoryCategoryCreated]: this
                        ._onInventoryCategoryCreated,
                    [InventoryCategoryUpdated]: this
                        ._onInventoryCategoryUpdated,
                    [InventoryCategoryActivated]: this
                        ._onInventoryCategoryActivated,
                    [InventoryCategoryInactivated]: this
                        ._onInventoryCategoryInactivated
                }
            ];
        },

        _onInventoryCategoryCreated(event) {
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
            this.inventoryCategories.insert({
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
            pubsub.publish("InventoryCategoryCreated", event);
        },

        _onInventoryCategoryUpdated(event) {
            let { _id, name, basePrice, baseUnit, prices, updatedAt } = event;
            let updatedFields = {
                name,
                basePrice,
                baseUnit,
                prices,
                updatedAt
            };
            this.inventoryCategories.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("InventoryCategoryUpdated", event);
        },

        _onInventoryCategoryActivated(event) {
            let { _id, updatedAt } = event;
            let updatedFields = { updatedAt, status: RecordStatus.ACTIVE };
            this.inventoryCategories.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("InventoryCategoryActivated", event);
        },

        _onInventoryCategoryInactivated(event) {
            let { _id, updatedAt } = event;
            let updatedFields = { updatedAt, status: RecordStatus.INACTIVE };
            this.inventoryCategories.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("InventoryCategoryInactivated", event);
        }
    }
);

export default InventoryCategoryProjection;
