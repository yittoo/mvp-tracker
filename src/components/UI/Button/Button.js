import React from "react";

import classes from "./Button.css";

const button = props => {
  const btnClasses = [classes.Button, classes[props.classes]];
  return (
    <button
      className={btnClasses.join(" ")}
      onClick={props.clicked}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default button;
