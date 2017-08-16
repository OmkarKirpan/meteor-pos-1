import { ItemPrice } from "../valueObjects";

export default {
    _id: String,
    brandId: String,
    categoryId: String,
    name: String,
    basePrice: Number,
    baseUnit: String,
    itemPrices: [ItemPrice],
    createdAt: Date,
    updatedAt: Date
};
