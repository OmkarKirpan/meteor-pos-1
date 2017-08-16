import { ENTITYSTATUS } from "../../../constants";
import categoryEvents from "../../../domain/Category/events";
import events from "../../../domain/Item/events";
import pubsub from "../../graphql/pubsub";

const { ItemCreated, ItemUpdated, ItemActivated, ItemDeactivated } = events;

const { CategoryDeactivated } = categoryEvents;

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
                [CategoryDeactivated]: this._onCategoryDeactivated
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

    _onCategoryDeactivated(event) {
        const { _id } = event;
        this.items.update(
            { categoryId: _id },
            {
                $set: {
                    categoryId: null
                }
            }
        );
    }
});

export default ItemProjection;
