import { ENTITYSTATUS } from "../../../constants";
import events from "../../../domain/Customer/events";
import pubsub from "../../graphql/pubsub";

const {
    CustomerCreated,
    CustomerUpdated,
    CustomerActivated,
    CustomerDeactivated
} = events;

const CustomerProjection = Space.eventSourcing.Projection.extend(
    "CustomerProjection",
    {
        collections: {
            customers: "Customers"
        },

        eventSubscriptions() {
            return [
                {
                    [CustomerCreated]: this._onCustomerCreated,
                    [CustomerUpdated]: this._onCustomerUpdated,
                    [CustomerActivated]: this._onCustomerActivated,
                    [CustomerDeactivated]: this._onCustomerDeactivated
                }
            ];
        },

        _onCustomerCreated(event) {
            event.entityStatus = ENTITYSTATUS.ACTIVE;
            const {
                _id,
                name,
                address,
                phoneNumber,
                cellphoneNumber,
                createdAt,
                updatedAt,
                entityStatus
            } = event;
            this.customers.insert({
                _id,
                name,
                address,
                phoneNumber,
                cellphoneNumber,

                createdAt,
                updatedAt,
                entityStatus
            });
            pubsub.publish("CustomerCreated", event);
        },

        _onCustomerUpdated(event) {
            const {
                _id,
                name,
                address,
                phoneNumber,
                cellphoneNumber,
                updatedAt
            } = event;
            const updatedFields = {
                name,
                address,
                phoneNumber,
                cellphoneNumber,

                updatedAt
            };
            this.customers.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("CustomerUpdated", event);
        },

        _onCustomerActivated(event) {
            event.entityStatus = ENTITYSTATUS.ACTIVE;
            const { _id, updatedAt, entityStatus } = event;
            const updatedFields = { updatedAt, entityStatus };
            this.customers.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("CustomerActivated", event);
        },

        _onCustomerDeactivated(event) {
            event.entityStatus = ENTITYSTATUS.INACTIVE;
            const { _id, updatedAt, entityStatus } = event;
            const updatedFields = { updatedAt, entityStatus };
            this.customers.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("CustomerDeactivated", event);
        }
    }
);

export default CustomerProjection;
