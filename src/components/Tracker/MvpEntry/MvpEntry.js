import React, { Component } from "react";
import Button from "../../UI/Button/Button";
import classes from "./MvpEntry.css";
import colors from "../../UI/Colors/Colors.css";
import { connect } from "react-redux";

class MvpEntry extends Component {
  state = {
    name: "Moonlight Flower",
    map: "pay_dun04",
    minSpawn: 60,
    maxSpawn: 70,
    color: "Purple",
    minTillSpawn: null,
    maxTillSpawn: null,
    minAgoValue: 0,
    timeKilled: null
  };

  componentWillMount() {
    this.killedNowHandler();
    this.calculateTimeToRespawn(
      this.state.timeKilled,
      this.state.minTillSpawn,
      this.state.maxTillSpawn
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.timeKilled !== this.state.timeKilled) {
      return true;
    } else {
      return false;
    }
  }

  calculateTimeToRespawn = (killedAt, minSpawn, maxSpawn) => {
    const currentDate = new Date();
    const differenceInMinutes = ((currentDate - killedAt) / 60000).toFixed(0);
    console.log(differenceInMinutes);
    return this.setState({
      ...this.state,
      minTillSpawn: minSpawn - differenceInMinutes,
      maxTillSpawn: maxSpawn - differenceInMinutes
    });
  };

  killedNowHandler = () => {
    const now = new Date();
    this.setState({
      ...this.state,
      timeKilled: now
    });
  };

  inputChangedHandler = event => {
    this.setState({
      ...this.state,
      minAgoValue: event.target.value
    });
    this.calculateTimeToRespawn(
      this.state.timeKilled,
      this.state.minTillSpawn,
      this.state.maxTillSpawn
    );
  };

  render() {
    const nameClasses = [classes.Name, colors.Blue];
    const untilSpawnClasses = [classes.UntilSpawn, colors[this.state.color]];

    return (
      <div className={classes.MvpEntry}>
        <div className={nameClasses.join(" ")}>Lord of the Dead</div>
        <div className={classes.FixedTimer}>60 - 70 minutes</div>
        <div className={classes.Map}>pay_dun04</div>
        <div className={untilSpawnClasses.join(" ")}>
          {this.state.minTillSpawn} - {this.state.maxTillSpawn}
          <span>
            <br />
            minutes more/ago
          </span>
        </div>
        <div className={classes.DeathTimer}>
          <p>
            Killed at: <br />
            {/* {this.state.timeKilled} */}
          </p>
        </div>
        <div className={classes.JustKilled}>
          <input
            className={classes.HideOnSmall}
            type="number"
            value={this.state.minAgoValue}
            placeholder="Killed ... minutes ago"
            onChange={this.inputChangedHandler}
            min="0"
            max="120"
          />
          <Button classes="HideOnSmall">Submit</Button>
          <Button classes="HideOnLarge" clicked={this.killedNowHandler}>
            Killed Now
          </Button>
        </div>
      </div>
    );
  }
}



export default connect(
  null,
  null
)(MvpEntry);
