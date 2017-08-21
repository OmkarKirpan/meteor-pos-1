import { ENTITYSTATUS } from "../../../constants";
import Orders from "../../../domain/Order/repository";
import events from "../../../domain/Item/events";
import itemAdjustmentEvents from "../../../domain/ItemAdjustment/events";
import orderEvents from "../../../domain/Order/events";
import pubsub from "../../graphql/pubsub";
import supplyOrderEvents from "../../../domain/SupplyOrder/events";

const { ItemCreated, ItemUpdated, ItemActivated, ItemDeactivated } = events;

const { SupplyOrderCreated } = supplyOrderEvents;

const { ItemAdjustmentCreated } = itemAdjustmentEvents;

const { OrderFinalized } = orderEvents;

const ItemProjection = Space.eventSourcing.Projection.extend("ItemProjection", {
    collections: {
        items: "Items"
    },

    eventSubscriptions() {
        return [
            {
                [ItemCreated]: this._onItemCreated,
                [ItemUpdated]: this._onItemUpdated,
                [ItemActivated]: this._onItemActivated,
                [ItemDeactivated]: this._onItemDeactivated,
                [SupplyOrderCreated]: this._onSupplyOrderCreated,
                [ItemAdjustmentCreated]: this._onItemAdjustmentCreated,
                [OrderFinalized]: this._onOrderFinalized
            }
        ];
    },

    _onItemCreated(event) {
        event.stock = 0;
        event.entityStatus = ENTITYSTATUS.ACTIVE;
        const {
            _id,
            name,
            brandId,
            categoryId,
            basePrice,
            baseUnit,
            itemPrices,
            createdAt,
            updatedAt,
            stock,
            entityStatus
        } = event;
        this.items.insert({
            _id,
            name,
            brandId,
            categoryId,
            stock,
            basePrice,
            baseUnit,
            itemPrices: itemPrices.map(itemPrice => {
                return {
                    unit: itemPrice.unit,
                    price: itemPrice.price,
                    multiplier: itemPrice.multiplier
                };
            }),
            entityStatus,
            createdAt,
            updatedAt
        });
        pubsub.publish("ItemCreated", event);
    },

    _onItemUpdated(event) {
        const {
            _id,
            name,
            brandId,
            categoryId,
            basePrice,
            baseUnit,
            itemPrices,
            updatedAt
        } = event;
        const updatedFields = {
            name,
            brandId,
            categoryId,
            basePrice,
            baseUnit,
            itemPrices: itemPrices.map(itemPrice => {
                return {
                    unit: itemPrice.unit,
                    price: itemPrice.price,
                    multiplier: itemPrice.multiplier
                };
            }),
            updatedAt
        };
        this.items.update(_id, { $set: { ...updatedFields } });
        pubsub.publish("ItemUpdated", event);
    },

    _onItemActivated(event) {
        event.entityStatus = ENTITYSTATUS.ACTIVE;
        const { _id, updatedAt, entityStatus } = event;
        const updatedFields = { updatedAt, entityStatus };
        this.items.update(_id, { $set: { ...updatedFields } });
        pubsub.publish("ItemActivated", event);
    },

    _onItemDeactivated(event) {
        event.entityStatus = ENTITYSTATUS.INACTIVE;
        const { _id, updatedAt, entityStatus } = event;
        const updatedFields = { updatedAt, entityStatus };
        this.items.update(_id, { $set: { ...updatedFields } });
        pubsub.publish("ItemDeactivated", event);
    },

    _onSupplyOrderCreated(event) {
        event.supplyItems.forEach(supplyItem => {
            const { itemId, quantity } = supplyItem;
            this.items.update(itemId, { $inc: { stock: quantity } });
        });
    },

    _onItemAdjustmentCreated(event) {
        event.adjustmentItems.forEach(adjustmentItem => {
            const { itemId, quantity } = adjustmentItem;
            this.items.update(itemId, { $inc: { stock: quantity } });
        });
    },

    _onOrderFinalized(event) {
        const { _id, orderItems } = event;
        orderItems.forEach(orderItem => {
            const soldQuantity = orderItem.itemPrices.reduce(
                (sum, itemPrice) => {
                    return sum + itemPrice.multiplier * itemPrice.quantity;
                },
                0
            );
            this.items.update(orderItem.itemId, {
                $inc: { stock: -soldQuantity }
            });
        });
    }
});

export default ItemProjection;
