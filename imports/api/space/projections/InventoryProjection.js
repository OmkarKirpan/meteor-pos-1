import { RecordStatus } from "../../../constants";
import categoryEvents from "../../../domain/Category/events";
import events from "../../../domain/Inventory/events";
import pubsub from "../../graphql/pubsub";

const {
    InventoryCreated,
    InventoryUpdated,
    InventoryActivated,
    InventoryInactivated
} = events;

const { CategoryActivated, CategoryInactivated } = categoryEvents;

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
                    [InventoryInactivated]: this._onInventoryInactivated,
                    [CategoryActivated]: this._onCategoryActivated,
                    [CategoryInactivated]: this._onCategoryInactivated
                }
            ];
        },

        _onInventoryCreated(event) {
            event.stock = 0;
            event.status = RecordStatus.ACTIVE;
            let {
                _id,
                name,
                categoryId,
                category,
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
                categoryId,
                category: {
                    name: category.name,
                    status: category.status
                },
                stock,
                basePrice,
                baseUnit,
                prices: prices.map(priceData => {
                    return {
                        unit: priceData.unit,
                        price: priceData.price,
                        multiplier: priceData.multiplier
                    };
                }),
                status,
                createdAt,
                updatedAt
            });
            pubsub.publish("InventoryCreated", event);
        },

        _onInventoryUpdated(event) {
            let {
                _id,
                name,
                categoryId,
                category,
                basePrice,
                baseUnit,
                prices,
                updatedAt
            } = event;
            let updatedFields = {
                name,
                categoryId,
                category: {
                    name: category.name,
                    status: category.status
                },
                basePrice,
                baseUnit,
                prices: prices.map(priceData => {
                    return {
                        unit: priceData.unit,
                        price: priceData.price,
                        multiplier: priceData.multiplier
                    };
                }),
                updatedAt
            };
            this.inventories.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("InventoryUpdated", event);
        },

        _onInventoryActivated(event) {
            event.status = RecordStatus.ACTIVE;
            let { _id, updatedAt, status } = event;
            let updatedFields = { updatedAt, status };
            this.inventories.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("InventoryActivated", event);
        },

        _onInventoryInactivated(event) {
            event.status = RecordStatus.INACTIVE;
            let { _id, updatedAt, status } = event;
            let updatedFields = { updatedAt, status };
            this.inventories.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("InventoryInactivated", event);
        },

        _onCategoryActivated(event) {
            let { _id } = event;
            this.inventories.update(
                { categoryId: _id },
                {
                    $set: {
                        "category.status": RecordStatus.ACTIVE
                    }
                }
            );
        },

        _onCategoryInactivated(event) {
            let { _id } = event;
            this.inventories.update(
                { categoryId: _id },
                {
                    $set: {
                        "category.status": RecordStatus.INACTIVE
                    }
                }
            );
        }
    }
);

export default InventoryProjection;
