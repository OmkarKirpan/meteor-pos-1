import { ORDER } from "../../actions/actionTypes";
import { ORDERSTATUS } from "../../../constants";
import { cloneDeep } from "lodash";
import moment from "moment";
import update from "react-addons-update";

const initialState = {
    orderList: {
        current: 1,
        pageSize: 10,
        total: 0,
        filter: {
            orderStatus: ORDERSTATUS.INPROGRESS
        },
        sort: "CREATED_AT_DESC"
    },
    orderForm: {
        isNew: true,
        visible: false,
        customers: [],
        editingOrder: {}
    },
    orderItemForm: {
        isNew: true,
        visible: false,
        items: [],
        editingOrderItem: {}
    }
};

const OrderReducer = (state = initialState, { type, payload = {} }) => {
    switch (type) {
        case ORDER.CHANGE_ORDER_PAGE:
            return update(state, {
                orderList: {
                    current: { $set: payload.current }
                }
            });
        case ORDER.SEARCH_ORDERS:
            return update(state, {
                orderList: {
                    filter: { $merge: payload.filter },
                    current: { $set: 1 }
                }
            });
        case ORDER.ORDER_FORM_OPEN:
            const editingOrder = cloneDeep(payload.order);
            if (editingOrder.orderDate)
                editingOrder.orderDate = moment(editingOrder.orderDate);
            if (!editingOrder.orderItems) editingOrder.orderItems = [];
            return update(state, {
                orderForm: {
                    isNew: { $set: payload.isNew },
                    editingOrder: { $set: editingOrder },
                    visible: { $set: true },
                    customers: {
                        $set: editingOrder.customer
                            ? [editingOrder.customer]
                            : []
                    }
                }
            });
        case ORDER.ORDER_FORM_CLOSE:
            return update(state, {
                orderForm: {
                    visible: { $set: false },
                    editingOrder: { $set: {} }
                }
            });
        case ORDER.ORDER_FORM_CHANGED:
            return update(state, {
                orderForm: {
                    editingOrder: { $merge: payload.order }
                }
            });
        case ORDER.REFRESH_CUSTOMERS:
            return update(state, {
                orderForm: {
                    customers: { $set: payload.customers }
                }
            });
        case ORDER.ORDER_ITEM_FORM_OPEN:
            let itemPriceCount = 0;
            let orderItem = { itemPriceCount };
            if (!payload.isNew) {
                orderItem = state.orderForm.editingOrder.orderItems.find(
                    item => item.itemId === payload.itemId
                );
                orderItem.itemPrices.forEach((itemPrice, itemPriceIdx) => {
                    orderItem.itemPrices[
                        itemPriceIdx
                    ].itemPriceId = itemPriceCount++;
                });
                orderItem.itemPriceCount = itemPriceCount;
            }
            return update(state, {
                orderItemForm: {
                    isNew: { $set: payload.isNew },
                    visible: { $set: true },
                    editingOrderItem: { $set: orderItem },
                    items: { $set: payload.isNew ? [] : [orderItem.item] }
                }
            });
        case ORDER.ORDER_ITEM_FORM_CLOSE:
            return update(state, {
                orderItemForm: {
                    visible: { $set: false },
                    editingOrderItem: { $set: {} }
                }
            });
        case ORDER.ORDER_ITEM_FORM_CHANGED:
            return update(state, {
                orderItemForm: {
                    editingOrderItem: { $merge: payload.orderItem }
                }
            });
        case ORDER.REFRESH_ITEMS:
            return update(state, {
                orderItemForm: {
                    items: { $set: payload.items }
                }
            });
        default:
            return state;
    }
};

export default OrderReducer;
