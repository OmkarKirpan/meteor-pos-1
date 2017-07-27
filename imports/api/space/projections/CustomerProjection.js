import { RecordStatus } from "../../../constants";
import events from "../../../domain/Customer/events";
import pubsub from "../../graphql/pubsub";

const {
    CustomerCreated,
    CustomerUpdated,
    CustomerActivated,
    CustomerInactivated
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
                    [CustomerInactivated]: this._onCustomerInactivated
                }
            ];
        },

        _onCustomerCreated(event) {
            event.status = RecordStatus.ACTIVE;
            let {
                _id,
                name,
                address,
                phoneNumber,
                createdAt,
                updatedAt,
                status
            } = event;
            this.customers.insert({
                _id,
                name,
                address,
                phoneNumber,
                createdAt,
                updatedAt,
                status
            });
            pubsub.publish("CustomerCreated", event);
        },

        _onCustomerUpdated(event) {
            let { _id, name, address, phoneNumber, updatedAt } = event;
            let updatedFields = {
                name,
                address,
                phoneNumber,
                updatedAt
            };
            this.customers.update(_id, {
                $set: { ...updatedFields }
            });
            pubsub.publish("CustomerUpdated", event);
        },

        _onCustomerActivated(event) {
            event.status = RecordStatus.ACTIVE;
            let { _id, updatedAt, status } = event;
            let updatedFields = { updatedAt, status };
            this.customers.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("CustomerActivated", event);
        },

        _onCustomerInactivated(event) {
            event.status = RecordStatus.INACTIVE;
            let { _id, updatedAt, status } = event;
            let updatedFields = { updatedAt, status };
            this.customers.update(_id, { $set: { ...updatedFields } });
            pubsub.publish("CustomerInactivated", event);
        }
    }
);

export default CustomerProjection;
