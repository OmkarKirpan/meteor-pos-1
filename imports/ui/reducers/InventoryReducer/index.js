import { INVENTORY } from "../../constants";
import update from "react-addons-update";

const initialState = {
    inventoryList: {
        current: 1,
        pageSize: 10,
        total: 0,
        filter: {},
        sort: "CREATED_AT_DESC"
    },
    inventoryForm: {
        isNew: true,
        visible: false,
        categories: [],
        editingInventory: {}
    }
};

const InventoryReducer = (state = initialState, { type, payload = {} }) => {
    const { current, total, filter, isNew, categories, inventory } = payload;
    switch (type) {
        case INVENTORY.CHANGE_INVENTORY_PAGE:
            return update(state, {
                inventoryList: {
                    current: { $set: current }
                }
            });
        case INVENTORY.SEARCH_INVENTORIES:
            return update(state, {
                inventoryList: {
                    filter: { $set: filter }
                }
            });
        case INVENTORY.INVENTORY_FORM_OPEN:
            return update(state, {
                inventoryForm: {
                    isNew: { $set: isNew },
                    editingInventory: { $set: inventory },
                    visible: { $set: true }
                }
            });
        case INVENTORY.INVENTORY_FORM_CLOSE:
            return update(state, {
                inventoryForm: {
                    visible: { $set: false },
                    editingInventory: { $set: {} }
                }
            });
        case INVENTORY.REFRESH_CATEGORIES:
            return update(state, {
                inventoryForm: {
                    categories: { $set: categories }
                }
            });
        case INVENTORY.INVENTORY_FORM_CHANGED:
            return update(state, {
                inventoryForm: {
                    editingInventory: { $merge: inventory }
                }
            });
        default:
            return state;
    }
};

export default InventoryReducer;
