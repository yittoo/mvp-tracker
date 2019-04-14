import React, { Component } from "react";
import classes from "./BackgroundManager.css";

class BackgroundManager extends Component {
  state = {
    left: null,
    right: null,
    leftStyle: {},
    rightStyle: {},
    currentWidth: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.theme && prevProps.theme !== this.props.theme) {
      let urlLeft, urlRight, leftStyle, rightStyle;
      if (this.props.theme === "default") {
        urlLeft = "https://i.postimg.cc/bJCbGPqC/atrocewhitebgflipped.jpg";
        urlRight = "https://i.postimg.cc/Xqt3T6qr/rsx.jpg";
      } else if (this.props.theme === "Bio Labs") {
        urlLeft = "https://i.postimg.cc/nzcq2k2P/bio-left.jpg";
        urlRight = "https://i.postimg.cc/jjhzy9Hf/bio-right.jpg";
        leftStyle = { height: "100%", width: "100%" };
        rightStyle = { height: "100%", width: "100%" };
      } else {
        urlLeft = "https://i.postimg.cc/bJCbGPqC/atrocewhitebgflipped.jpg";
        urlRight = "https://i.postimg.cc/Xqt3T6qr/rsx.jpg";
      }
      if (window.innerWidth > 500) {
        this.setState({
          ...this.state,
          left: urlLeft,
          right: urlRight,
          leftStyle: leftStyle,
          rightStyle: rightStyle,
          currentWidth: window.innerWidth
        });
      } else {
        this.setState({
          ...this.state,
          left: urlLeft,
          currentWidth: window.innerWidth,
          leftStyle: leftStyle,
          rightStyle: rightStyle
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props || nextState !== this.state) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    return (
      <div className={classes.BackgroundManager}>
        <div className={classes.Left}>
          <img src={this.state.left} style={this.state.leftStyle} />
        </div>
        <div className={classes.Right}>
          <img src={this.state.right} style={this.state.rightStyle} />
        </div>
      </div>
    );
  }
}

export default BackgroundManager;
