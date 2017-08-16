import { OrderItem, ShipmentInfo } from "../valueObjects";

export default {
    _id: String,
    shipmentInfo: ShipmentInfo,
    orderItems: [OrderItem],
    updatedAt: Date
};
