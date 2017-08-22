import { SESSION, USER } from "../../actions/actionTypes";

import update from "react-addons-update";

export const initialState = {
    userList: {
        current: 1,
        pageSize: 10,
        total: 0,
        filter: {},
        sort: "CREATED_AT_DESC"
    }
};

const UserReducer = (state = initialState, { type, payload = {} }) => {
    switch (type) {
        case USER.CHANGE_USER_PAGE:
            return update(state, {
                userList: {
                    current: { $set: payload.current }
                }
            });
        case USER.SEARCH_USERS:
            return update(state, {
                userList: {
                    filter: { $merge: payload.filter }
                }
            });
        case SESSION.LOGGED_IN:
        case SESSION.LOGGED_OUT:
            return initialState;
        default:
            return state;
    }
};

export default UserReducer;
