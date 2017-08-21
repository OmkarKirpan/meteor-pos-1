import { SupplyOrderItem } from "../valueObjects";

export default {
    _id: String,
    orderNo: String,
    supplierId: String,
    orderDate: Date,
    supplyItems: [SupplyOrderItem],
    discount: Number,
    createdAt: Date,
    updatedAt: Date
};
