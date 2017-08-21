import { Modal } from "antd";
import { SESSION } from "../actionTypes";
import i18n from "meteor/universe:i18n";

const login = ({ username, password }) => dispatch => {
    Meteor.loginWithPassword(username, password, err => {
        if (err) {
            console.error(err);
            Modal.error({ title: i18n.__("login-failed") });
        } else dispatch({ type: SESSION.LOGGED_IN });
    });
};

const logout = () => dispatch => {
    Meteor.logout(err => {
        if (err) {
            console.error(err);
            Modal.error({ title: i18n.__("logout-failed") });
        } else dispatch({ type: SESSION.LOGGED_OUT });
    });
};

const register = ({ username, password }) => dispatch => {
    Accounts.createUser({ username, password }, err => {
        if (err) {
            console.error(err);
            Modal.error({ title: i18n.__("registration-failed") });
        }
    });
};

const openChangePasswordForm = () => dispatch => {
    dispatch({
        type: SESSION.OPEN_CHANGE_PASSWORD_FORM
    });
};

const closeChangePasswordForm = () => dispatch => {
    dispatch({
        type: SESSION.CLOSE_CHANGE_PASSWORD_FORM
    });
};

export {
    login,
    logout,
    register,
    openChangePasswordForm,
    closeChangePasswordForm
};
