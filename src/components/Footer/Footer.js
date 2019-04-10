import React, { Component } from "react";
import classes from "./Footer.css";

class Footer extends Component {
  state = {};
  render() {
    return (
      <div className={classes.Footer}>
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
