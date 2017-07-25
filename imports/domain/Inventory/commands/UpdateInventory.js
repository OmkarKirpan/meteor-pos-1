import { InventoryCategory, InventoryPrice } from "../valueObjects";

export default {
    _id: String,
    categoryId: String,
    name: String,
    basePrice: Number,
    baseUnit: String,
    prices: [InventoryPrice],
    updatedAt: Date
};
