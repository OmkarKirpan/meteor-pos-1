const InventoryCategory = Space.domain.ValueObject.extend("InventoryCategory", {
    Constructor({ name, status }) {
        let data = { name, status };
        Space.domain.ValueObject.call(this, data);
        Object.freeze(this);
    },
    fields() {
        return {
            name: String,
            status: Number
        };
    }
});

export default InventoryCategory;
