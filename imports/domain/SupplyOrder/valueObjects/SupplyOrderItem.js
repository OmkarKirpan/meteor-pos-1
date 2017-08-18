const SupplyOrderItem = Space.domain.ValueObject.extend("SupplyOrderItem", {
    Constructor({ itemId, quantity, price, discount }) {
        const data = { itemId, quantity, price, discount };
        Space.domain.ValueObject.call(this, data);
        Object.freeze(this);
    },
    fields() {
        return {
            itemId: String,
            quantity: Number,
            price: Number,
            discount: Number
        };
    }
});

export default SupplyOrderItem;
