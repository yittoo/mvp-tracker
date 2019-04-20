import React from "react";

import classes from "./Button.css";

const button = props => {
  const btnClasses = [classes.Button, classes[props.classes]];
  return (
    <button
      type={props.type}
      className={btnClasses.join(" ")}
      onClick={props.clicked}
      disabled={props.disabled}
      style={props.style}
    >
      {props.children}
    </button>
  );
};

export default button;
