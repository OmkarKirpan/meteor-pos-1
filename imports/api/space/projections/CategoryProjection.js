import { ENTITYSTATUS } from "../../../constants";
import events from "../../../domain/Category/events";
import pubsub from "../../graphql/pubsub";

const {
    CategoryCreated,
    CategoryUpdated,
    CategoryActivated,
    CategoryDeactivated
} = events;

const CategoryProjection = Space.eventSourcing.Projection.extend(
    "CategoryProjection",
    {
        collections: {
            categories: "Categories"
        },

        eventSubscriptions() {
            return [
                {
                    [CategoryCreated]: this._onCategoryCreated,
                    [CategoryUpdated]: this._onCategoryUpdated,
                    [CategoryActivated]: this._onCategoryActivated,
                    [CategoryDeactivated]: this._onCategoryDeactivated
                }
            ];
        },

        _onCategoryCreated(event) {
            event.entityStatus = ENTITYSTATUS.ACTIVE;
            const { _id, name, createdAt, updatedAt, entityStatus } = event;
            this.categories.insert({
                _id,
                name,
                entityStatus,
                createdAt,
                updatedAt
            });
            pubsub.publish("CategoryCreated", event);
        },

        _onCategoryUpdated(event) {
            const { _id, name, updatedAt } = event;
            const updatedFields = {
                name,
                updatedAt
            };
            this.categories.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("CategoryUpdated", event);
        },

        _onCategoryActivated(event) {
            event.entityStatus = ENTITYSTATUS.ACTIVE;
            const { _id, updatedAt, entityStatus } = event;
            const updatedFields = { updatedAt, entityStatus };
            this.categories.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("CategoryActivated", event);
        },

        _onCategoryDeactivated(event) {
            event.entityStatus = ENTITYSTATUS.INACTIVE;
            const { _id, updatedAt, entityStatus } = event;
            const updatedFields = { updatedAt, entityStatus };
            this.categories.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("CategoryDeactivated", event);
        }
    }
);

export default CategoryProjection;
