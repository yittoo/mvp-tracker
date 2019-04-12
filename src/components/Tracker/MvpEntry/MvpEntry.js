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

  componentDidMount() {
    this.interval = setInterval(() => {
      this.onShouldNotificate();
    }, 60000);
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
      this.props.mvp,
      "killed"
    );
    this.setState({ ...this.state, minAgoValue: 0 });
  };

  onMvpDeletedBtn = mvpKey => {
    this.props.mvpKilledOrDeletedHandler(
      null,
      mvpKey,
      this.props.userKey,
      this.props.token,
      this.props.trackerKey,
      null,
      "delete"
    );
    this.setState({ ...this.state, minAgoValue: 0 });
  };

  onMvpNotiToggleBtn = mvpKey => {
    const mvpToCast = {
      ...this.props.mvp,
      notification: !this.props.mvp.notification
    };
    this.props.mvpKilledOrDeletedHandler(
      null,
      mvpKey,
      this.props.userKey,
      this.props.token,
      this.props.trackerKey,
      mvpToCast,
      "toggleNotification"
    );
    this.setState({ ...this.state, minAgoValue: 0 });
  };

  onShouldNotificate = () => {
    console.log(this.props.notiMode)
    if (
      this.props.notiMode === "all" ||
      (this.props.notiMode === "custom" && this.props.mvp.notification)
    ) {
      let notificationToSend;
      notificationToSend =
        this.props.mvp.minTillSpawn === 10
          ? { mvpKey: this.props.id, type: "tenTillMin" }
          : null;
      notificationToSend =
        this.props.mvp.minTillSpawn === 0
          ? { mvpKey: this.props.id, type: "onMin" }
          : notificationToSend;
      notificationToSend =
        this.props.mvp.maxTillSpawn === 0
          ? { mvpKey: this.props.id, type: "onMax" }
          : notificationToSend;
      if (notificationToSend) {
        this.props.onNotificate(notificationToSend);
      }
    }
  };

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

    const mvpDeleteBtn = this.state.deleteMode ? (
      <Button clicked={() => this.onMvpDeletedBtn(this.props.id)}>
        Delete
      </Button>
    ) : null;

    const mvpNotiToggleBtn =
      this.props.notiMode === "custom" ? (
        <Button clicked={() => this.onMvpNotiToggleBtn(this.props.id)}>
          {this.props.mvp.notification
            ? "Disable Notification"
            : "Enable Notification"}
        </Button>
      ) : null;

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
          {mvpNotiToggleBtn}
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
    trackerKey: state.mvp.activeTrackerKey,
    notiMode: state.mvp.notificationSettings.notiMode.mode
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
    mvpKilledOrDeletedHandler: (
      minuteAgo,
      mvpKey,
      userKey,
      token,
      trackerKey,
      mvp,
      eventType
    ) => {
      return dispatch(
        actions.saveSingleMvpToDb(
          minuteAgo,
          mvpKey,
          userKey,
          token,
          trackerKey,
          mvp,
          eventType
        )
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MvpEntry);
