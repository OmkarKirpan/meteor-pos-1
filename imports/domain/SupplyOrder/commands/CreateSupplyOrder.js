import { SupplyOrderItem } from "../valueObjects";

export default {
    _id: String,
    supplierId: String,
    orderDate: Date,
    supplyItems: [SupplyOrderItem],
    discount: Number,
    createdAt: Date,
    updatedAt: Date
};
