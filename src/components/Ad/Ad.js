import React from "react";
import classes from "./Ad.css";

const Ad = props => {
  let adClasses = [classes.Ad];

  switch (props.type) {
    case "vertical":
      adClasses.push(classes.Vertical);
      adClasses.push(props.alignment === "left" ? classes.Left : classes.Right);
      break;
    case "horizontal":
      adClasses.push(classes.Horizontal);
      adClasses.push(props.alignment === "top" ? classes.Top : classes.Bottom);
      break;
    default:
      break;
  }

  return <div className={adClasses.join(" ")}>Ad image</div>;
};

export default Ad;
