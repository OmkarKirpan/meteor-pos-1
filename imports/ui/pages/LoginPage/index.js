import { LoginForm, RegistrationForm } from "../../components";
import React, { Component } from "react";
import { login, register } from "../../actions";

import { Button } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import i18n from "meteor/universe:i18n";

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
        this.setState({ login: !this.state.login });
    }

    render() {
        const { login, register } = this.props.actions;
        const showLogin = this.state.login;
        const switchButton = (
            <Button
                style={{ marginTop: "10px" }}
                onClick={() => this.switchLoginState()}
            >
                {i18n.__(showLogin ? "register-here" : "login-here")}
            </Button>
        );
        return (
            <div>
                <div key="login-form">
                    {showLogin &&
                        <LoginForm login={login} switchButton={switchButton} />}
                </div>
                <div key="registration-form">
                    {!showLogin &&
                        <RegistrationForm
                            register={register}
                            switchButton={switchButton}
                        />}
                </div>
            </div>
        );
    }
}

export default LoginPage;
