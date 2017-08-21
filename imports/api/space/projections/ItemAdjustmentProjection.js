import { ENTITYSTATUS } from "../../../constants";
import events from "../../../domain/ItemAdjustment/events";
import pubsub from "../../graphql/pubsub";

const { ItemAdjustmentCreated } = events;

const ItemAdjustmentProjection = Space.eventSourcing.Projection.extend(
    "ItemAdjustmentProjection",
    {
        collections: {
            itemAdjustments: "ItemAdjustments"
        },

        eventSubscriptions() {
            return [
                {
                    [ItemAdjustmentCreated]: this._onItemAdjustmentCreated
                }
            ];
        },

        _onItemAdjustmentCreated(event) {
            event.entityStatus = ENTITYSTATUS.ACTIVE;
            const {
                _id,
                adjustmentNo,
                adjustmentDate,
                adjustmentItems,
                reason,
                createdAt,
                updatedAt,
                entityStatus
            } = event;
            this.itemAdjustments.insert({
                _id,
                adjustmentNo,
                adjustmentDate,
                adjustmentItems: adjustmentItems.map(adjustmentItem => {
                    return {
                        itemId: adjustmentItem.itemId,
                        quantity: adjustmentItem.quantity
                    };
                }),
                reason,
                createdAt,
                updatedAt,
                entityStatus
            });
            pubsub.publish("ItemAdjustmentCreated", event);
        }
    }
);

export default ItemAdjustmentProjection;
