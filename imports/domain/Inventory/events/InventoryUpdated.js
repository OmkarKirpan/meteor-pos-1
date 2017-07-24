import { InventoryPrice } from "../valueObjects";

export default {
    _id: String,
    name: String,
    basePrice: Number,
    baseUnit: String,
    prices: [InventoryPrice],
    updatedAt: Date
};
