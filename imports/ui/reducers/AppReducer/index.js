import { APP, SESSION } from "../../actions/actionTypes";

import update from "react-addons-update";

export const initialState = {
    sidebarCollapsed: false
};

const AppReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case APP.TOGGLE_SIDEBAR:
            return update(state, {
                sidebarCollapsed: { $set: !state.sidebarCollapsed }
            });
        case SESSION.LOGGED_IN:
        case SESSION.LOGGED_OUT:
            return initialState;
        default:
            return state;
    }
};

export default AppReducer;
