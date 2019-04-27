import React, { Component } from "react";
import classes from './TrackerLogs.css';
import colors from '../../UI/Colors/Colors.css';

class TrackerLogs extends Component {
  state = {
    showLogs: false
  };
  render() {
    let sortableLogsArr = [];
    for (let logKey in this.props.currentLogs) {
      sortableLogsArr.push([
        this.props.currentLogs[logKey],
        new Date(this.props.currentLogs[logKey].date).getTime(),
        logKey
      ]);
    }

    sortableLogsArr.sort(function(a, b) {
      return a[1] - b[1];
    });

    let logArrToRender = [];
    sortableLogsArr.forEach(orderedLogPair => {
      let eleToPush;
      switch (orderedLogPair[0].type) {
        case "A":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>{Math.floor((new Date() - orderedLogPair[1])/60000)}</span>{" "}
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span> has been added by{" "}
              <span className={colors.Purple}>{orderedLogPair[0].nickname}</span> to tracker
            </li>
          );
          break;
        case "D":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>{Math.floor((new Date() - orderedLogPair[1])/60000)}</span>{" "}
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span> has been deleted by{" "}
              <span className={colors.Purple}>{orderedLogPair[0].nickname}</span> from tracker
            </li>
          );
          break;
        case "L":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>{Math.floor((new Date() - orderedLogPair[1])/60000)}</span> Timer of{" "}
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span> has been changed by{" "}
              <span className={colors.Purple}>{orderedLogPair[0].nickname}</span>
            </li>
          );
          break;
        case "M":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>{Math.floor((new Date() - orderedLogPair[1])/60000)}</span>{" "}
              <span className={colors.Purple}>{orderedLogPair[0].nickname}:</span>
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span>
            </li>
          );
          break;
        case "T":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>{Math.floor((new Date() - orderedLogPair[1])/60000)}</span> Tombstone of{" "}
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span> has been changed by{" "}
              <span className={colors.Purple}>{orderedLogPair[0].nickname}</span>
            </li>
          );
          break;
        case "N":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>{Math.floor((new Date() - orderedLogPair[1])/60000)}</span> Note of{" "}
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span> has been changed by{" "}
              <span className={colors.Purple}>{orderedLogPair[0].nickname}</span>
            </li>
          );
          break;
        case "U":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>{Math.floor((new Date() - orderedLogPair[1])/60000)}</span> Timer change of{" "}
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span> has been undone by{" "}
              <span className={colors.Purple}>{orderedLogPair[0].nickname}</span>
            </li>
          );
          break;
        default:
          break;
      }
      logArrToRender.push(eleToPush);
    });
    return (
      <div className={classes.TrackerLogs}>
        <ul>{logArrToRender}</ul>
      </div>
    );
  }
}

export default TrackerLogs;
