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
                orderDate,
                supplyItems,
                discount,
                createdAt,
                updatedAt,
                entityStatus
            } = event;
            this.items.insert({
                _id,
                orderDate,
                supplyItems: supplyItems.map(supplyItem => {
                    return {
                        itemId: supplyItem.unit,
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
