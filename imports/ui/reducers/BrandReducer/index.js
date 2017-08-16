import { BRAND } from "../../actions/actionTypes";
import update from "react-addons-update";

const initialState = {
    brandList: {
        current: 1,
        pageSize: 10,
        total: 0,
        filter: {},
        sort: "CREATED_AT_DESC"
    },
    brandForm: {
        isNew: true,
        visible: false,
        editingBrand: {}
    }
};

const BrandReducer = (state = initialState, { type, payload = {} }) => {
    switch (type) {
        case BRAND.CHANGE_BRAND_PAGE:
            return update(state, {
                brandList: {
                    current: { $set: payload.current }
                }
            });
        case BRAND.SEARCH_BRANDS:
            return update(state, {
                brandList: {
                    filter: { $merge: payload.filter }
                }
            });
        case BRAND.BRAND_FORM_OPEN:
            return update(state, {
                brandForm: {
                    isNew: { $set: payload.isNew },
                    editingBrand: { $set: payload.brand },
                    visible: { $set: true }
                }
            });
        case BRAND.BRAND_FORM_CLOSE:
            return update(state, {
                brandForm: {
                    visible: { $set: false },
                    editingBrand: { $set: {} }
                }
            });
        case BRAND.BRAND_FORM_CHANGED:
            return update(state, {
                brandForm: {
                    editingBrand: { $merge: payload.brand }
                }
            });
        default:
            return state;
    }
};

export default BrandReducer;
