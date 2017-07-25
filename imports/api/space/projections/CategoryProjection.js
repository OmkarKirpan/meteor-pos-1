import { RecordStatus } from "../../../constants";
import events from "../../../domain/Category/events";
import pubsub from "../../graphql/pubsub";

const {
    CategoryCreated,
    CategoryUpdated,
    CategoryActivated,
    CategoryInactivated
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
                    [CategoryInactivated]: this._onCategoryInactivated
                }
            ];
        },

        _onCategoryCreated(event) {
            event.status = RecordStatus.ACTIVE;
            let { _id, name, createdAt, updatedAt, status } = event;
            this.categories.insert({
                _id,
                name,
                status,
                createdAt,
                updatedAt
            });
            pubsub.publish("CategoryCreated", event);
        },

        _onCategoryUpdated(event) {
            let { _id, name, updatedAt } = event;
            let updatedFields = {
                name,
                updatedAt
            };
            this.categories.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("CategoryUpdated", event);
        },

        _onCategoryActivated(event) {
            event.status = RecordStatus.ACTIVE;
            let { _id, updatedAt, status } = event;
            let updatedFields = { updatedAt, status };
            this.categories.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("CategoryActivated", event);
        },

        _onCategoryInactivated(event) {
            event.status = RecordStatus.INACTIVE;
            let { _id, updatedAt, status } = event;
            let updatedFields = { updatedAt, status };
            this.categories.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("CategoryInactivated", event);
        }
    }
);

export default CategoryProjection;
