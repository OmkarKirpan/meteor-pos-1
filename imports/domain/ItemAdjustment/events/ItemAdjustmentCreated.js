import { ItemAdjustmentItem } from "../valueObjects";

export default {
    _id: String,
    adjustmentNo: String,
    adjustmentDate: Date,
    adjustmentItems: [ItemAdjustmentItem],
    reason: String,
    createdAt: Date,
    updatedAt: Date
};
