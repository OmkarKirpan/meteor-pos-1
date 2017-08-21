export default `
    input ItemAdjustmentSearchFilter {
        adjustmentDate: Date
    }

    input ItemAdjustmentItemInput {
        itemId: String
        quantity: Int
    }

    input CreateItemAdjustmentInput {
        adjustmentDate: Date
        adjustmentItems: [ItemAdjustmentItemInput]
        reason: String
    }
`;
