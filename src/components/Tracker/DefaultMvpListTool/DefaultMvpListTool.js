import React, { Component } from "react";
import preMvps from "../../../assets/default/preMvps.json";
import renewalMvps from "../../../assets/default/renewalMvps.json";
import Button from "../../UI/Button/Button";
import classes from "./DefaultMvpListTool.css";
import { withRouter } from "react-router-dom";
import { storeMvps } from '../../../utility/utility';


class DefaultMvpListTool extends Component {
  updateParent = () => {
    this.props.refreshed();
  };

  setPreReHandler = () => {
    storeMvps(preMvps, this.props.isPremium);
    this.updateParent();
    this.props.history.replace("/tracker");
  };

  setRenewalHandler = () => {
    storeMvps(renewalMvps, this.props.isPremium);
    this.updateParent();
    this.props.history.replace("/tracker");
  };

  render() {
    const dataToRender = !this.props.parentUpdated ? (
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
    ) : null;

    return <div className={classes.DefaultMvpListTool}>{dataToRender}</div>;
  }
}

export default withRouter(DefaultMvpListTool);
