import { ENTITYSTATUS } from "../../../constants";
import events from "../../../domain/Brand/events";
import pubsub from "../../graphql/pubsub";

const { BrandCreated, BrandUpdated } = events;

const BrandProjection = Space.eventSourcing.Projection.extend(
    "BrandProjection",
    {
        collections: {
            brands: "Brands"
        },

        eventSubscriptions() {
            return [
                {
                    [BrandCreated]: this._onBrandCreated,
                    [BrandUpdated]: this._onBrandUpdated
                }
            ];
        },

        _onBrandCreated(event) {
            event.entityStatus = ENTITYSTATUS.ACTIVE;
            const { _id, name, createdAt, updatedAt, entityStatus } = event;
            this.brands.insert({
                _id,
                name,
                entityStatus,
                createdAt,
                updatedAt
            });
            pubsub.publish("BrandCreated", event);
        },

        _onBrandUpdated(event) {
            const { _id, name, updatedAt } = event;
            const updatedFields = {
                name,
                updatedAt
            };
            this.brands.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("BrandUpdated", event);
        }
    }
);

export default BrandProjection;
