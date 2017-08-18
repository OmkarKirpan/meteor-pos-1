const ItemAdjustmentItem = Space.domain.ValueObject.extend(
    "ItemAdjustmentItem",
    {
        Constructor({ itemId, quantity }) {
            const data = { itemId, quantity };
            Space.domain.ValueObject.call(this, data);
            Object.freeze(this);
        },
        fields() {
            return {
                itemId: String,
                quantity: Number
            };
        }
    }
);

export default ItemAdjustmentItem;
