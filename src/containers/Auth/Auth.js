import React, { Component } from "react";
import Button from "../../components/UI/Button/Button";
import { Redirect, withRouter } from "react-router-dom";
import Input from "../../components/UI/Input/Input";
import classes from "./Auth.css";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import HeaderBar from "../../components/UI/HeaderBar/HeaderBar";

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "E-mail"
        },
        value: "",
        validation: {
          isEmail: true,
          required: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password"
        },
        value: "",
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    },
    isSignup: false,
    isForgot: false,
    forgotValue: "",
    nickname:
      localStorage.getItem("nickname") !== "Undefined"
        ? localStorage.getItem("nickname")
        : "",
    message: null,
    keepLogged: false
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (rules) {
      if (rules.required) {
        isValid = value.trim() !== "" && isValid;
      }
      if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
      }
      if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
      }
    }
    return isValid;
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true
      }
    };
    this.setState({ controls: updatedControls });
  };

  submitHandler = event => {
    event.preventDefault();
    if (this.state.keepLogged) {
      localStorage.setItem("keepLogged", true);
    }
    let nickname = this.state.nickname;
    if (nickname === "") {
      nickname = "Undefined";
    }
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignup,
      this.state.keepLogged,
      nickname
    );
  };

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return { isSignup: !prevState.isSignup };
    });
  };

  switchForgotModeHandler = () => {
    this.setState(prevState => {
      return { ...prevState, isForgot: !prevState.isForgot };
    });
  };

  forgotChangedHandler = event => {
    this.setState({
      ...this.state,
      forgotValue: event.target.value
    });
  };

  nicknameChangedHandler = event => {
    this.setState({
      ...this.state,
      nickname: event.target.value
    });
  };

  forgotSubmitHandler = event => {
    event.preventDefault();
    this.props.resetPassword(this.state.forgotValue);
    this.setState({
      ...this.state,
      message: "E-mail has been sent, please check your inbox and junk"
    });
  };

  checkboxHandler = event => {
    this.setState(prevState => ({
      ...prevState,
      keepLogged: !prevState.keepLogged
    }));
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    let form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementtype={formElement.config.elementType}
        elementconfig={formElement.config.elementConfig}
        value={formElement.config.value}
        changed={event => this.inputChangedHandler(event, formElement.id)}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
      />
    ));

    let errorMessage = null;

    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }

    const authRedirect = this.props.isAuthenticated ? (
      <Redirect to={"/tracker"} />
    ) : null;

    const forgotForm = (
      <form className={classes.ForgotForm} onSubmit={this.forgotSubmitHandler}>
        <p>{this.state.message}</p>
        <input
          type="text"
          value={this.state.forgotValue}
          onChange={this.forgotChangedHandler}
          placeholder="E-mail you used when you registered"
        />
        <Button
          type="submit"
          classes="ButtonAuth"
          disabled={this.state.message}
        >
          SUBMIT
        </Button>
      </form>
    );

    let dataToRender = !this.state.isForgot ? (
      <React.Fragment>
        <form onSubmit={this.submitHandler}>
          {form}
          <input
            className={classes.Nickname}
            type="text"
            value={this.state.nickname}
            onChange={this.nicknameChangedHandler}
            placeholder="Nickname"
          />
          <div className={classes.CheckboxContainer}>
            <label>Keep me signed in: </label>
            <input
              type="checkbox"
              checked={this.state.keepLogged}
              onChange={this.checkboxHandler}
            />
          </div>
          <p className={classes.Legal}>
            Our trackers uses cookies to work please enable them if you haven't
            {this.state.isSignup
              ? ", by hitting sign up you accept that you've read and accepted our terms of service and privacy policy, that is located at bottom of this page"
              : null}
          </p>
          <Button classes="ButtonAuth">
            {this.state.isSignup ? "REGISTER" : "LOGIN"}
          </Button>
        </form>
        <Button classes="ButtonAuth" clicked={this.switchAuthModeHandler}>
          SWITCH TO {this.state.isSignup ? "LOGIN" : "REGISTER"}
        </Button>
      </React.Fragment>
    ) : (
      forgotForm
    );

    if (this.props.loading) {
      dataToRender = <Spinner />;
    }

    return (
      <div className={classes.Auth}>
        <HeaderBar>Authentication</HeaderBar>
        {errorMessage}
        {authRedirect}
        {dataToRender}
        <br />
        {!this.props.loading ? (
          <Button classes="ButtonAuth" clicked={this.switchForgotModeHandler}>
            FORGOT MY PASSWORD
          </Button>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup, keepLogged, nickname) =>
      dispatch(actions.auth(email, password, isSignup, keepLogged, nickname)),
    resetPassword: email => dispatch(actions.sendPasswordReset(email))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Auth)
);
