import { OrderItem } from "../valueObjects";

export default {
    _id: String,
    orderItems: [OrderItem],
    updatedAt: Date
};
