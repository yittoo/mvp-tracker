import React, { Component } from "react";
import classes from "./Tracker.css";
import { connect } from "react-redux";

class Tracker extends Component {
  state = {};
  render() {
    return <h1 className={classes.Tracker}>something recieved from redux { this.props.something }</h1>;
  }
}

const mapStateToProps = state => {
  return {
    something: state.something
  };
};

const mapDispatchToProps = dispatch => {
  return {
    something: null
  };
};

export default connect(
  mapStateToProps,
  null
)(Tracker);
