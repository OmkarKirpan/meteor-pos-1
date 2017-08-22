import { APP } from "../actionTypes";

const toggleSidebar = () => dispatch => {
    dispatch({
        type: APP.TOGGLE_SIDEBAR
    });
};

export { toggleSidebar };
