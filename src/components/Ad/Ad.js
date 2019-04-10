import React, { Component } from "react";
import classes from "./Ad.css";

class Ad extends Component {
  state = {};
  constructor(props) {
    super(props);
    if (this.props.type === "horizontal" && this.props.alignment === "bottom") {
      this.state = {
        fixedFooterState:
          window.innerHeight + 200 <
          document.getElementById("root").clientHeight
      };
      this.interval = setInterval(() => {
        this.setState({
          fixedFooterState:
            window.innerHeight + 200 <
            document.getElementById("root").clientHeight
        });
      }, 200);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.type === "horizontal" && this.props.alignment === "bottom") {
      if (nextState.fixedFooterState !== this.state.fixedFooterState) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  componentWillUnmount() {
    if (this.props.type === "horizontal" && this.props.alignment === "bottom") {
      clearInterval(this.interval);
    }
  }

  render() {
    let adClasses = [classes.Ad];

    switch (this.props.type) {
      case "vertical":
        adClasses.push(classes.Vertical);
        adClasses.push(
          this.props.alignment === "left" ? classes.Left : classes.Right
        );
        break;
      case "horizontal":
        adClasses.push(classes.Horizontal);
        adClasses.push(
          this.props.alignment === "top" ? classes.Top : classes.Bottom
        );
        break;
      default:
        break;
    }

    if(this.state.fixedFooterState){
      adClasses.push("Fixed")
    }
    return (
      <div style={this.props.style} className={adClasses.join(" ")}>
        Ad image
      </div>
    );
  }
}

export default Ad;
