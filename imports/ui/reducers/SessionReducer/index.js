import { SESSION } from "../../actions/actionTypes";
import update from "react-addons-update";

export const initialState = {
    changePasswordForm: {
        visible: false
    }
};

const SessionReducer = (state = initialState, { type, payload = {} }) => {
    switch (type) {
        case SESSION.OPEN_CHANGE_PASSWORD_FORM:
            return update(state, {
                changePasswordForm: {
                    visible: { $set: true }
                }
            });
        case SESSION.CLOSE_CHANGE_PASSWORD_FORM:
            return update(state, {
                changePasswordForm: {
                    visible: { $set: false }
                }
            });
        case SESSION.LOGGED_IN:
        case SESSION.LOGGED_OUT:
            return initialState;
        default:
            return state;
    }
};

export default SessionReducer;
