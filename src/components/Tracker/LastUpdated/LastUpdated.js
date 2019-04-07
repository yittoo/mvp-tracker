import React, { Component } from "react";
import classes from "./LastUpdated.css";

class LastUpdated extends Component {
  state = { timeToShow: null };

  constructor(props) {
    super(props);
    this.state = {
      timeToShow: (
        (new Date().getTime() - props.lastTime.getTime()) /
        1000
      ).toFixed(0)
    };
  }

  componentDidMount() {
    this.interval = setInterval(() =>
      this.setState({
        timeToShow: (
          (new Date().getTime() - this.props.lastTime.getTime()) /
          1000
        ).toFixed(0)
      }), 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className={classes.LastUpdated}>
        <p>
          Last Updated: {this.state.timeToShow}
        </p>
      </div>
    );
  }
}

export default LastUpdated;
