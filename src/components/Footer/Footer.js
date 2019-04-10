import React, { Component } from "react";
import classes from "./Footer.css";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fixedFooterState: window.innerHeight + 200 < document.getElementById("root").clientHeight,
    };
    this.interval = setInterval(() => {
      this.setState({
        fixedFooterState: window.innerHeight + 200 < document.getElementById("root").clientHeight,
      });
    }, 200)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.fixedFooterState !== this.state.fixedFooterState
    ) {
      return true;
    } else {
      return false;
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const footerClasses = this.state.fixedFooterState
      ? classes.Footer
      : classes.Footer + " " + classes.Fixed;
    return (
      <div className={footerClasses}>
        <p>Copyrighted 2019</p>
        <p>
          By using this website you accept that you have read, understood and
          accepted our
        </p>
        <p>
          <span
            className={classes.Link}
            onClick={() => this.props.onLegal("showPrivacyStatement")}
          >
            Privacy Statement
          </span>{" "}
          and{" "}
          <span
            className={classes.Link}
            onClick={() => this.props.onLegal("showTermsOfService")}
          >
            Terms of Service
          </span>
        </p>
      </div>
    );
  }
}

export default Footer;
