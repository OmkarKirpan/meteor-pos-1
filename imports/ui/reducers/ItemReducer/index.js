import { ITEM } from "../../actions/actionTypes";
import { cloneDeep } from "lodash";
import update from "react-addons-update";
const initialState = {
    itemList: {
        current: 1,
        pageSize: 10,
        total: 0,
        filter: {},
        sort: "CREATED_AT_DESC"
    },
    itemForm: {
        isNew: true,
        visible: false,
        brands: [],
        categories: [],
        editingItem: {}
    }
};

const ItemReducer = (state = initialState, { type, payload = {} }) => {
    switch (type) {
        case ITEM.CHANGE_ITEM_PAGE:
            return update(state, {
                itemList: {
                    current: { $set: payload.current }
                }
            });
        case ITEM.SEARCH_ITEMS:
            return update(state, {
                itemList: {
                    filter: { $merge: payload.filter }
                }
            });
        case ITEM.ITEM_FORM_OPEN:
            const editingItem = cloneDeep(payload.item);
            editingItem.priceCount = 0;
            editingItem.itemPrices &&
                editingItem.itemPrices.forEach((itemPrice, idx, itemPrices) => {
                    itemPrices[idx].itemPriceId = editingItem.priceCount++;
                });
            return update(state, {
                itemForm: {
                    isNew: { $set: payload.isNew },
                    editingItem: { $set: editingItem },
                    visible: { $set: true }
                }
            });
        case ITEM.ITEM_FORM_CLOSE:
            return update(state, {
                itemForm: {
                    visible: { $set: false },
                    editingItem: { $set: {} }
                }
            });
        case ITEM.REFRESH_CATEGORIES:
            return update(state, {
                itemForm: {
                    categories: { $set: payload.categories }
                }
            });
        case ITEM.REFRESH_BRANDS:
            return update(state, {
                itemForm: {
                    brands: { $set: payload.brands }
                }
            });
        case ITEM.ITEM_FORM_CHANGED:
            return update(state, {
                itemForm: {
                    editingItem: { $merge: payload.item }
                }
            });
        default:
            return state;
    }
};

export default ItemReducer;
