import React, { Component } from "react";
import Button from "../../components/UI/Button/Button";
import { Redirect , withRouter } from "react-router-dom";
import Input from "../../components/UI/Input/Input";
import classes from "./Auth.css";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import HeaderBar from '../../components/UI/HeaderBar/HeaderBar';

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
    isSignup: false
  };

//   componentDidMount() {
//     if (!this.props.buildingBurger && this.props.authRedirect !== "/") {
//       this.props.onSetAuthRedirectPath();
//     }
//   }

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
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignup
    );
    this.props.history.replace("/tracker");
  };

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return { isSignup: !prevState.isSignup };
    });
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

    if (this.props.loading) {
      form = <Spinner />;
    }

    let errorMessage = null;

    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }

    const authRedirect = this.props.isAuthenticated ? (
      <Redirect to={"/tracker"} />
    ) : null;

    return (
      <div className={classes.Auth}>
        <HeaderBar>Authentication</HeaderBar>
        {errorMessage}
        {authRedirect}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button classes="ButtonAuth">
            {this.state.isSignup ? "SIGNUP" : "SIGNIN"}
          </Button>
        </form>
        <Button classes="ButtonAuth" clicked={this.switchAuthModeHandler}>
          SWITCH TO {this.state.isSignup ? "SIGNIN" : "SIGNUP"}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup))
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth));
