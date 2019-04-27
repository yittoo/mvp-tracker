import React, { Component } from "react";
import { makeId } from "../../utility/utility";
import Input from "../UI/Input/Input";
import Spinner from "../UI/Spinner/Spinner";
import { connect } from "react-redux";
import Button from "../UI/Button/Button";
import classes from "./NewMvpForm.css";
import xss from "xss";

class Form extends Component {
  state = {};

  setInitialStates = () => {
    this.setState({
      ...this.state,
      mvpForm: {
        name: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "MvP's Name"
          },
          value: "",
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        map: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "Map Name"
          },
          value: "",
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        id: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "MvP Id (optional)"
          },
          value: "",
          valid: true,
          touched: false
        },
        minSpawn: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "Minimum minutes till spawn"
          },
          validation: {
            isNumber: true,
            required: true
          },
          value: "",
          valid: false,
          touched: false
        },
        maxSpawn: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "Maximum minutes till spawn"
          },
          validation: {
            isNumber: true,
            required: true
          },
          value: "",
          valid: false,
          touched: false
        }
      },
      formIsValid: false
    });
  };

  componentWillMount() {
    this.setInitialStates();
  }

  submitMvpHandler = event => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in this.state.mvpForm) {
      formData[formElementIdentifier] = xss(
        this.state.mvpForm[formElementIdentifier].value
      );
    }
    formData.minTillSpawn = null;
    formData.maxTillSpawn = null;
    formData.timeKilled = null;
    this.addMvpToDbHandler(formData, formData.name);
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (rules) {
      if (rules.required) {
        isValid = value.trim() !== "" && isValid;
      }
      if (rules.isNumber) {
        isValid = !isNaN(value) && isValid;
      }
    }
    return isValid;
  }

  inputChangedHandler = (event, key) => {
    const mvpForm = { ...this.state.mvpForm };
    const mvpFormChild = { ...mvpForm[key] };
    mvpFormChild.value = event.target.value;
    mvpFormChild.valid = this.checkValidity(
      mvpFormChild.value,
      mvpFormChild.validation
    );
    mvpFormChild.touched = true;
    mvpForm[key] = mvpFormChild;
    if (key === "name") {
      mvpForm[key].value =
        mvpForm[key].value.charAt(0).toUpperCase() +
        mvpForm[key].value.slice(1);
    }
    let formIsValid = true;
    for (let inputIdentifier in mvpForm) {
      formIsValid = mvpForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ mvpForm: mvpForm, formIsValid: formIsValid });
  };

  addMvpToDbHandler = (formData, mvpName) => {
    let currentMvps = this.props.currentMvps
      ? { ...this.props.currentMvps }
      : {};
    const hash = mvpName + " " + makeId(8)
    currentMvps[hash] = formData;
    this.props.onNewMvpAdded(currentMvps, mvpName);
    this.setInitialStates();
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.mvpForm) {
      formElementsArray.push({
        id: key,
        config: this.state.mvpForm[key]
      });
    }
    let form = (
      <form onSubmit={this.submitMvpHandler}>
        {formElementsArray.map(formElement => (
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
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          Submit
        </Button>
      </form>
    );
    if (this.props.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.NewMvpForm}>
        <h4>Enter your new MvP entry</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentMvps: state.mvp.mvps
  };
};

export default connect(
  mapStateToProps,
  null
)(Form);
