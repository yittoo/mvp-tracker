import React, { Component } from "react";
import classes from "./Tracker.css";
import { connect } from "react-redux";
import MvpEntry from "./MvpEntry/MvpEntry";
import * as actions from "../../store/actions";

class Tracker extends Component {
  componentWillMount() {
    this.interval = setInterval(this.props.updateCurrentTime, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const mvpsArray = Object.keys(this.props.mvps).map(mvp => {
      return <MvpEntry key={mvp} id={mvp} mvp={this.props.mvps[mvp]} />;
    });
    return <div className={classes.Tracker}>{mvpsArray}</div>;
  }
}

const mapStateToProps = state => {
  return {
    mvps: state.mvps
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateCurrentTime: () => dispatch(actions.updateCurrentTime())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tracker);
