import { USER } from "../actionTypes";

const changeUsersPage = ({ current }) => (dispatch, getState) => {
    dispatch({
        type: USER.CHANGE_USER_PAGE,
        payload: {
            current
        }
    });
};

const searchUsers = ({ filter }) => dispatch => {
    dispatch({
        type: USER.SEARCH_USERS,
        payload: {
            filter
        }
    });
};

export { changeUsersPage, searchUsers };
