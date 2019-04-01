import React from "react";
import classes from "./HeaderBar.css";
import colors from "../Colors/Colors.css";

const HeaderBar = props => {
  const headerClass = [classes.HeaderBar, colors.BlueWhiteBackground];
  return <div className={headerClass.join(" ")}>{props.children}</div>;
};

export default HeaderBar;
