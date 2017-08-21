export default `
    type ItemAdjustmentItem {
        itemId: String
        quantity: Int
        item: Item
    }

    type ItemAdjustment {
        _id: String
        adjustmentNo: String
        adjustmentDate: Date
        adjustmentItems: [ItemAdjustmentItem]
        reason: String
        entityStatus: Int
        createdAt: Date
        updatedAt: Date
    }

    type ItemAdjustmentEvent {
        ItemAdjustmentCreated: ItemAdjustment
    }
`;
