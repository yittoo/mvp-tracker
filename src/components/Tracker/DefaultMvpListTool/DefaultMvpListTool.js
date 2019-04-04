import React, { Component } from "react";
import preMvps from "../../../assets/default/preMvps.json";
import Button from "../../UI/Button/Button";
import classes from "./DefaultMvpListTool.css";

class DefaultMvpListTool extends Component {
  updateParent = () => {
    this.props.refreshed();
  };

  setPreReHandler = () => {
    localStorage.setItem("mvps", JSON.stringify(preMvps));
    this.updateParent();
  };

  render() {
    const dataToRender = !this.props.parentUpdated ? (
      <React.Fragment>
        <Button classes="ButtonDefaultOrCustom" clicked={this.setPreReHandler}>
          Pre-Re
        </Button>
        <Button
          classes="ButtonDefaultOrCustom"
          clicked={() => {
            console.log("clicked");
          }}
        >
          TODO Renewal
        </Button>
      </React.Fragment>
    ) : null;

    return <div className={classes.DefaultMvpListTool}>{dataToRender}</div>;
  }
}

export default DefaultMvpListTool;
