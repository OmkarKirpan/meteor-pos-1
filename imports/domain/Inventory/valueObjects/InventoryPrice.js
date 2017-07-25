const InventoryPrice = Space.domain.ValueObject.extend("InventoryPrice", {
    Constructor({ unit, price, multiplier }) {
        let data = { unit, price, multiplier };
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

export default InventoryPrice;
