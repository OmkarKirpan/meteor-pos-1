const login = ({ username, password }) => dispatch => {
    Meteor.loginWithPassword(username, password, err => {
        if (err) console.error(err);
    });
};

const logout = () => dispatch => {
    Meteor.logout();
};

const register = ({ username, password }) => dispatch => {
    Accounts.createUser({ username, password }, err => {
        if (err) console.error(err);
    });
};

const changePassword = ({ oldPassword, newPassword }) => dispatch => {
    Accounts.changePassword(oldPassword, newPassword, err => {
        if (err) console.error(err);
    });
};

export { login, logout, register, changePassword };
