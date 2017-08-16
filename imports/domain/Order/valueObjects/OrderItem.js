const OrderItem = Space.domain.ValueObject.extend("OrderItem", {
    Constructor({ itemId, itemPrices, discount }) {
        const data = { itemId, itemPrices, discount };
        Space.domain.ValueObject.call(this, data);
        Object.freeze(this);
    },
    fields() {
        return {
            itemId: String,
            itemPrices: [
                {
                    unit: String,
                    multiplier: Number,
                    quantity: Number,
                    price: Number,
                    discount: Number
                }
            ],
            discount: Number
        };
    }
});

export default OrderItem;
