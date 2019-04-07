import React, { Component } from "react";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Profile.css";
import { connect } from "react-redux";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions";
import HeaderBar from "../../components/UI/HeaderBar/HeaderBar";

class Profile extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <HeaderBar>Profile Section</HeaderBar>
        <div className={classes.Profile}>
          <p>
            Reset Password{" "}
            <Button
              clicked={() =>
                this.props.resetPassword(localStorage.getItem("loggedEmail"))
              }
            >
              Reset
            </Button>
          </p>
          <p>Reset Tracker</p>
          <p>Delete Account</p>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetPassword: email => dispatch(actions.sendPasswordReset(email))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Profile);
