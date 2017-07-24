const InventoryPrice = Space.domain.ValueObject.extend("InventoryPrice", {
    fields() {
        return {
            unit: String,
            price: Number,
            multiplier: Number
        };
    }
});

export default InventoryPrice;
