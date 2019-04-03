import React, { Component } from "react";
import Button from "../../UI/Button/Button";
import classes from "./MvpEntry.css";
import colors from "../../UI/Colors/Colors.css";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";

class MvpEntry extends Component {
  state = {
    minAgoValue: 0
  };

  componentDidMount() {
    this.props.calculateTimeTillSpawn(
      this.props.mvp.timeKilled,
      this.props.mvp.minSpawn,
      this.props.mvp.maxSpawn,
      this.props.currentTime,
      this.props.id
    );
    this.interval = setInterval(
      () =>
        this.props.calculateTimeTillSpawn(
          this.props.mvp.timeKilled,
          this.props.mvp.minSpawn,
          this.props.mvp.maxSpawn,
          this.props.currentTime,
          this.props.id
        ),
      60000
    );
  }

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
    if (prevProps.mvp.timeKilled !== this.props.mvp.timeKilled) {
      this.props.calculateTimeTillSpawn(
        this.props.mvp.timeKilled,
        this.props.mvp.minSpawn,
        this.props.mvp.maxSpawn,
        this.props.currentTime,
        this.props.id
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  inputChangedHandler = event => {
    const value = event.target.value < 0 ? 0 : event.target.value;
    this.setState({
      ...this.state,
      minAgoValue: Number(value)
    });
  };

  render() {
    
    const nameClasses = [classes.Name, colors.Blue];

    let untilSpawnColor =
      Number(this.props.mvp.minTillSpawn) > 10 ? "Purple" : "Green";
    untilSpawnColor =
      Number(this.props.mvp.maxTillSpawn) <= 0 ? "Red" : untilSpawnColor;
    untilSpawnColor =
      this.props.mvp.maxTillSpawn === "Unknown" ? "LightGray" : untilSpawnColor;

    const agoOrMore = untilSpawnColor === "Red" ? "ago" : "more";
    const untilSpawnClasses = [classes.UntilSpawn, colors[untilSpawnColor]];

    const timeKilled = new Date(this.props.mvp.timeKilled).getFullYear() !== 1970 ? new Date(this.props.mvp.timeKilled) : "Unavailable" ;

    return (
      <div className={classes.MvpEntry}>
        <div className={nameClasses.join(" ")}>{this.props.mvp.name}</div>
        <div className={classes.FixedTimer}>
          {this.props.mvp.minSpawn} - {this.props.mvp.maxSpawn} minutes
        </div>
        <div className={classes.Map}>{this.props.mvp.map}</div>
        <div className={untilSpawnClasses.join(" ")}>
          {this.props.mvp.minTillSpawn} - {this.props.mvp.maxTillSpawn}
          <span>
            <br />
            minutes {agoOrMore}
          </span>
        </div>
        {/* <div className={classes.DeathTimer}>
          <p>
            Killed at: <br />
            {/* {this.props.mvp.timeKilled ? this.props.mvp.timeKilled.getHour() : "No last entry"} }
            {timeKilled.getDate ? timeKilled.getDate() : timeKilled}
          </p>
        </div> */}
        <div className={classes.JustKilled}>
          <input
            className={classes.HideOnSmall}
            type="number"
            value={this.state.minAgoValue}
            min="0"
            placeholder="Killed ... minutes ago"
            onChange={this.inputChangedHandler}
          />
          <Button
            classes="HideOnSmall"
            clicked={() =>
              this.props.mvpKilledHandler(this.state.minAgoValue, this.props.id)
            }
          >
            Submit
          </Button>
          <Button
            classes="HideOnLarge"
            clicked={() => {
              this.props.mvpKilledHandler(0, this.props.id);
            }}
          >
            Killed Now
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentTime: state.currentTime
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
    mvpKilledHandler: (minuteAgo, mvpId) => {
      return dispatch(actions.mvpKilled(minuteAgo, mvpId));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MvpEntry);
