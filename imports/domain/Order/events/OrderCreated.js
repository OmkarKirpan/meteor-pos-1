import { OrderItem, ShipmentInfo } from "../valueObjects";

export default {
    _id: String,
    orderNo: String,
    orderDate: Date,
    customerId: String,
    shipmentInfo: ShipmentInfo,
    orderItems: [OrderItem],
    createdAt: Date,
    updatedAt: Date
};
