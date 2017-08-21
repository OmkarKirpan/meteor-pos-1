import { APP, SESSION } from "../../actions/actionTypes";

import update from "react-addons-update";

const initialState = {
    sidebarCollapsed: false,
    userMenuOpened: false,
    openMenus: []
};

const AppReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case APP.TOGGLE_SIDEBAR:
            return update(state, {
                sidebarCollapsed: { $set: !state.sidebarCollapsed }
            });
        case APP.TOGGLE_USER_MENU:
            return update(state, {
                userMenuOpened: { $set: !state.userMenuOpened }
            });
        case SESSION.LOGGED_IN:
        case SESSION.LOGGED_OUT:
            return initialState;
        default:
            return state;
    }
};

export default AppReducer;
