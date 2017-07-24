import React, { Component } from "react";

import { LoginForm } from "../../components";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { login } from "../../actions";

const mapStateToProps = store => {
    return store;
};

const mapDispatchToProps = dispatch => {
    const { login } = dispatch;
    return {
        actions: bindActionCreators(
            {
                login
            },
            dispatch
        )
    };
};

@connect(mapStateToProps, mapDispatchToProps)
class LoginPage extends Component {
    constructor() {
        super();
        this.login = this.login.bind(this);
    }

    login(username, password) {
        this.props.actions.login(username, password);
    }

    render() {
        return (
            <div key="login-form">
                <LoginForm login={this.login} />
            </div>
        );
    }
}

export default LoginPage;
