const SupplyOrderItem = Space.domain.ValueObject.extend("SupplyOrderItem", {
    Constructor({ itemId, quantity, price }) {
        const data = { itemId, quantity, price };
        Space.domain.ValueObject.call(this, data);
        Object.freeze(this);
    },
    fields() {
        return {
            itemId: String,
            quantity: Number,
            price: Number
        };
    }
});

export default SupplyOrderItem;
