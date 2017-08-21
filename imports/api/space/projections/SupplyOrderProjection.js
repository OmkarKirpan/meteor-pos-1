import { ENTITYSTATUS } from "../../../constants";
import events from "../../../domain/SupplyOrder/events";
import pubsub from "../../graphql/pubsub";

const { SupplyOrderCreated } = events;

const SupplyOrderProjection = Space.eventSourcing.Projection.extend(
    "SupplyOrderProjection",
    {
        collections: {
            supplyOrders: "SupplyOrders"
        },

        eventSubscriptions() {
            return [
                {
                    [SupplyOrderCreated]: this._onSupplyOrderCreated
                }
            ];
        },

        _onSupplyOrderCreated(event) {
            event.entityStatus = ENTITYSTATUS.ACTIVE;
            const {
                _id,
                supplierId,
                orderNo,
                orderDate,
                supplyItems,
                discount,
                createdAt,
                updatedAt,
                entityStatus
            } = event;
            this.supplyOrders.insert({
                _id,
                supplierId,
                orderNo,
                orderDate,
                supplyItems: supplyItems.map(supplyItem => {
                    return {
                        itemId: supplyItem.itemId,
                        quantity: supplyItem.quantity,
                        price: supplyItem.price
                    };
                }),
                discount,
                createdAt,
                updatedAt,
                entityStatus
            });
            pubsub.publish("SupplyOrderCreated", event);
        }
    }
);

export default SupplyOrderProjection;
