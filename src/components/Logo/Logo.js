import React from "react";

import priestLogo from "../../assets/images/priest_male.jpg";
import classes from "./Logo.css";

const logo = (props) => {
  return (
    <div className={classes.Logo} style={{height: props.height}}>
      <img src={priestLogo} alt="Priest Logo" />
    </div>
  );
};

export default logo;
