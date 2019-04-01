import React, { Component } from "react";
import Button from "../../UI/Button/Button";
import classes from "./MvpEntry.css";
import colors from "../../UI/Colors/Colors.css";
import { connect } from 'react-redux';



class MvpEntry extends Component {

  differenceToMinutesArray = (killedAt, minSpawn, maxSpawn) => {
    const differenceInMinutes = ((Date() - killedAt) / 60000).toFixed(0);
    const differenceArr = [
      minSpawn - differenceInMinutes,
      maxSpawn - differenceInMinutes
    ];
  };
  render() {
    const killedAtDate = new Date("April 1, 2019 03:24:00");
    const currentDate = new Date();
    const timeDifference = currentDate - killedAtDate;
    const toMinutes = timeDifference / 60000;
    console.log(toMinutes.toFixed(0));
    const nameClasses = [classes.Name, colors.Blue];
    const untilSpawnClasses = [classes.UntilSpawn, colors.Purple];
    return (
      <div className={classes.MvpEntry}>
        <div className={nameClasses.join(" ")}>Moonlight Flower</div>
        <div className={classes.FixedTimer}>60 - 70 minutes</div>
        <div className={classes.Map}>pay_dun04</div>
        <div className={untilSpawnClasses.join(" ")}>
          32 - 42
          <span>
            <br />
            minutes more/ago
          </span>
        </div>
        <div className={classes.DeathTimer}>
          Killed at: <br />
          {Date()}
        </div>
        <div className={classes.JustKilled}>
          <Button>Just Killed</Button>
        </div>
      </div>
    );
  }
}

export default connect(null,null)(MvpEntry);
