import React, { Component } from "react";
import preMvps from "../../../assets/default/preMvps.json";
import renewalMvps from "../../../assets/default/renewalMvps.json";
import Button from "../../UI/Button/Button";
import classes from "./DefaultMvpListTool.css";
import { withRouter } from "react-router-dom";

class DefaultMvpListTool extends Component {
  refreshed() {
    this.props.onRefreshed();
  }

  setPreReHandler = () => {
    this.props.createNewTracker(preMvps);
    this.refreshed();
    this.props.history.replace("/tracker");
  };

  setRenewalHandler = () => {
    this.props.createNewTracker(renewalMvps);
    this.refreshed();
    this.props.history.replace("/tracker");
  };

  render() {
    const dataToRender = (
      <React.Fragment>
        <Button classes="ButtonDefaultOrCustom" clicked={this.setPreReHandler}>
          Pre-Re
        </Button>
        <Button
          classes="ButtonDefaultOrCustom"
          clicked={this.setRenewalHandler}
        >
          Renewal
        </Button>
      </React.Fragment>
    );

    return <div className={classes.DefaultMvpListTool}>{dataToRender}</div>;
  }
}

export default withRouter(DefaultMvpListTool);
