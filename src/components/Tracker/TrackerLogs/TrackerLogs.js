import React, { Component } from "react";
import classes from "./TrackerLogs.css";
import colors from "../../UI/Colors/Colors.css";

class TrackerLogs extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  

  stringifyDate = dateAsMiliSec => {
    let d = new Date(dateAsMiliSec);
    const minutes =
        d.getMinutes().toString().length === 1
          ? "0" + d.getMinutes()
          : d.getMinutes(),
      hours =
        d.getHours().toString().length === 1
          ? "0" + d.getHours()
          : d.getHours(),
      months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      date =
        d.getDate().toString().length === 1 ? "0" + d.getDate() : d.getDate();
    return (
      date +
      " " +
      months[d.getMonth()] +
      " " +
      d.getFullYear() +
      " - " +
      hours +
      ":" +
      minutes +
      " | "
    );
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
              <span className={colors.Gray + " " + classes.Date}>
                {this.stringifyDate(orderedLogPair[1])}
              </span>{" "}
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span>{" "}
              added by{" "}
              <span className={colors.Purple}>
                {orderedLogPair[0].nickname}
              </span>{" "}
              to tracker
            </li>
          );
          break;
        case "D":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>
                {this.stringifyDate(orderedLogPair[1])}
              </span>{" "}
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span>{" "}
              deleted by{" "}
              <span className={colors.Purple}>
                {orderedLogPair[0].nickname}
              </span>{" "}
              from tracker
            </li>
          );
          break;
        case "L":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>
                {this.stringifyDate(orderedLogPair[1])}
              </span>{" "}
              Timer of{" "}
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span>{" "}
              changed by{" "}
              <span className={colors.Purple}>
                {orderedLogPair[0].nickname}
              </span>
            </li>
          );
          break;
        case "M":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>
                {this.stringifyDate(orderedLogPair[1])}
              </span>{" "}
              <span className={colors.Purple}>
                {orderedLogPair[0].nickname}:
              </span>
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span>
            </li>
          );
          break;
        case "T":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>
                {this.stringifyDate(orderedLogPair[1])}
              </span>{" "}
              Tombstone of{" "}
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span>{" "}
              changed by{" "}
              <span className={colors.Purple}>
                {orderedLogPair[0].nickname}
              </span>
            </li>
          );
          break;
        case "N":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>
                {this.stringifyDate(orderedLogPair[1])}
              </span>{" "}
              Note of{" "}
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span>{" "}
              changed by{" "}
              <span className={colors.Purple}>
                {orderedLogPair[0].nickname}
              </span>
            </li>
          );
          break;
        case "U":
          eleToPush = (
            <li key={orderedLogPair[2]}>
              <span className={colors.Gray + " " + classes.Date}>
                {this.stringifyDate(orderedLogPair[1])}
              </span>{" "}
              Timer change of{" "}
              <span className={colors.Blue}>{orderedLogPair[0].payload}</span>{" "}
              undone by{" "}
              <span className={colors.Purple}>
                {orderedLogPair[0].nickname}
              </span>
            </li>
          );
          break;
        default:
          break;
      }
      logArrToRender.push(eleToPush);
    });

    const trackerLogElement = document.querySelector(`.${classes.TrackerLogs}`);

    if (trackerLogElement && trackerLogElement.scrollHeight > 200) {
      trackerLogElement.scrollTop = trackerLogElement.scrollHeight - 200;
    }

    return (
      <div className={classes.TrackerLogs}>
        <ul>{logArrToRender}</ul>
      </div>
    );
  }
}

export default TrackerLogs;
