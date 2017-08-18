import { LoginForm, RegistrationForm } from "../../components";
import React, { Component } from "react";
import { login, register } from "../../actions";

import { Button } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const mapStateToProps = store => {
    return store;
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                login,
                register
            },
            dispatch
        )
    };
};

@connect(mapStateToProps, mapDispatchToProps)
class LoginPage extends Component {
    constructor() {
        super();
        this.switchLoginState = this.switchLoginState.bind(this);
    }

    componentWillMount() {
        this.setState({ login: true });
    }

    switchLoginState() {
        console.dir(this.state.login);
        this.setState({ login: !this.state.login });
        console.dir(this.state.login);
    }

    render() {
        const { login, register } = this.props.actions;
        const showLogin = this.state.login;
        return (
            <div>
                <div key="login-form">
                    {showLogin && <LoginForm login={login} />}
                </div>
                <div key="registration-form">
                    {!showLogin && <RegistrationForm register={register} />}
                </div>
                <Button onClick={() => this.switchLoginState()}>test</Button>
            </div>
        );
    }
}

export default LoginPage;
