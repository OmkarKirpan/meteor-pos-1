const ShipmentInfo = Space.domain.ValueObject.extend("ShipmentInfo", {
    Constructor({ address, phoneNumber, cellphoneNumber }) {
        const data = { address, phoneNumber, cellphoneNumber };
        Space.domain.ValueObject.call(this, data);
        Object.freeze(this);
    },
    fields() {
        return {
            address: String,
            phoneNumber: String,
            cellphoneNumber: String
        };
    }
});

export default ShipmentInfo;
