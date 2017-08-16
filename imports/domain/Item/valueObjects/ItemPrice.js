const ItemPrice = Space.domain.ValueObject.extend("ItemPrice", {
    Constructor({ unit, price, multiplier }) {
        const data = { unit, price, multiplier };
        Space.domain.ValueObject.call(this, data);
        Object.freeze(this);
    },
    fields() {
        return {
            unit: String,
            price: Number,
            multiplier: Number
        };
    }
});

export default ItemPrice;
