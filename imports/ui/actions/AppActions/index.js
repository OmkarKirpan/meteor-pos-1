import { APP } from "../actionTypes";

const toggleSidebar = () => dispatch => {
    dispatch({
        type: APP.TOGGLE_SIDEBAR
    });
};

const selectMenu = ({ key }) => dispatch => {
    dispatch({
        type: APP.SELECT_MENU,
        payload: {
            key
        }
    });
};

const toggleUserMenu = () => dispatch => {
    dispatch({
        type: APP.TOGGLE_USER_MENU
    });
};

export { toggleSidebar, toggleUserMenu, selectMenu };
