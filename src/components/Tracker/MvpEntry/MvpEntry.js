import React, { Component } from "react";
import Button from "../../UI/Button/Button";
import classes from "./MvpEntry.css";
import colors from "../../UI/Colors/Colors.css";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import Modal from "../../UI/Modal/Modal";

class MvpEntry extends Component {
  state = {
    minAgoValue: 0,
    showModal: false,
    deleteMode: localStorage.getItem("mvpDeleteMode") === "true"
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.mvp !== this.props.mvp ||
      nextState.minAgoValue !== this.state.minAgoValue
    ) {
      return true;
    } else {
      return false;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.mvp.timeKilled !== this.props.mvp.timeKilled &&
      this.state.mvpKilled
    ) {
      this.props.calculateTimeTillSpawn(
        this.props.mvp.timeKilled,
        this.props.mvp.minSpawn,
        this.props.mvp.maxSpawn,
        this.props.currentTime,
        this.props.id
      );
      this.setState({
        ...this.state,
        mvpKilled: false
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  inputChangedHandler = event => {
    const value =
      event.target.value < 0 || isNaN(event.target.value)
        ? 0
        : event.target.value;
    this.setState({
      ...this.state,
      minAgoValue: Number(value)
    });
  };

  onMvpKilledBtn = (minAgo, mvpKey) => {
    this.props.mvpKilledOrDeletedHandler(
      minAgo,
      mvpKey,
      this.props.userKey,
      this.props.token,
      this.props.trackerKey,
      this.props.mvp
    );
    this.setState({ ...this.state, minAgoValue: 0, mvpKilled: true });
  };

  onMvpDeletedBtn = (mvpKey) => {
    this.props.mvpKilledOrDeletedHandler(
      null,
      mvpKey,
      this.props.userKey,
      this.props.token,
      this.props.trackerKey,
      null
    );
  }

  render() {
    const nameClasses = [classes.Name, colors.Blue];

    let untilSpawnColor =
      Number(this.props.mvp.minTillSpawn) > 10 ? "Purple" : "Green";
    untilSpawnColor =
      Number(this.props.mvp.maxTillSpawn) <= 0 ? "Red" : untilSpawnColor;
    untilSpawnColor =
      this.props.mvp.maxTillSpawn === "Unknown" ||
      this.props.mvp.maxTillSpawn === undefined ||
      this.props.mvp.maxTillSpawn === null
        ? "LightGray"
        : untilSpawnColor;

    const agoOrMore = untilSpawnColor === "Red" ? "ago" : "more";
    const untilSpawnClasses = [classes.UntilSpawn, colors[untilSpawnColor]];

    const untilSpawnValue =
      this.props.mvp.minTillSpawn === "Unknown" ||
      this.props.mvp.minTillSpawn === undefined ||
      this.props.mvp.minTillSpawn === null
        ? "Unknown"
        : this.props.mvp.minTillSpawn + " - " + this.props.mvp.maxTillSpawn;

    const minuteInput = (
      <input
        className={classes.HideOnSmall}
        type="text"
        value={this.state.minAgoValue}
        min="0"
        placeholder="Killed ... minutes ago"
        onChange={this.inputChangedHandler}
      />
    );

    const mvpDeleteBtn = this.state.deleteMode ? <Button clicked={() => this.onMvpDeletedBtn(this.props.id)}>Delete</Button> : null;

    return (
      <div className={classes.MvpEntry}>
        <div className={nameClasses.join(" ")}>{this.props.mvp.name}</div>
        <div className={classes.FixedTimer}>
          {this.props.mvp.minSpawn} - {this.props.mvp.maxSpawn} minutes
        </div>
        <div className={classes.Map}>{this.props.mvp.map}</div>
        <div className={untilSpawnClasses.join(" ")}>
          {untilSpawnValue}
          <span>
            <br />
            minutes {agoOrMore}
          </span>
        </div>
        <div className={classes.Killed}>
          <span>Killed</span>
          {minuteInput}

          <span className={classes.MarginRight5px}>minutes ago</span>
          <Button
            classes="HideOnSmall"
            clicked={() =>
              this.onMvpKilledBtn(this.state.minAgoValue, this.props.id)
            }
          >
            Submit
          </Button>
          <Button
            classes="HideOnLarge"
            clicked={() => {
              this.onMvpKilledBtn(0, this.props.id);
            }}
          >
            Killed Now
          </Button>
          {mvpDeleteBtn}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentTime: state.mvp.currentTime,
    userKey: state.mvp.userKey,
    token: state.auth.token,
    trackerKey: state.mvp.activeTrackerKey
  };
};

const mapDispatchToProps = dispatch => {
  return {
    calculateTimeTillSpawn: (
      killedAt,
      minSpawn,
      maxSpawn,
      currentTime,
      mvpId
    ) =>
      dispatch(
        actions.calculateTimeToSpawn(
          killedAt,
          minSpawn,
          maxSpawn,
          currentTime,
          mvpId
        )
      ),
    mvpKilledOrDeletedHandler: (minuteAgo, mvpKey, userKey, token, trackerKey, mvp) => {
      return dispatch(
        actions.saveSingleMvpToDb(
          minuteAgo,
          mvpKey,
          userKey,
          token,
          trackerKey,
          mvp
        )
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MvpEntry);
