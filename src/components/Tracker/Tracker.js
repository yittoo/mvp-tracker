import React, { Component } from "react";
import classes from "./Tracker.css";
import { connect } from "react-redux";
import MvpEntry from "./MvpEntry/MvpEntry";

class Tracker extends Component {
  state = {};
  render() {
    return (
      <div className={classes.Tracker}>
        <MvpEntry />
        <MvpEntry />
        <MvpEntry />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    somethingg: null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    something: null
  };
};

export default connect(
  null,
  null
)(Tracker);
