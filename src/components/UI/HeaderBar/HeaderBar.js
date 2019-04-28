import React from "react";
import classes from "./HeaderBar.css";
import colors from "../Colors/Colors.css";

const HeaderBar = props => {
  let headerClass = [classes.HeaderBar, colors.BlueWhiteBackground];
  if(props.flippedAndCentered) headerClass.push(classes.FlippedAndCentered);
  if(props.marginTop) headerClass.push(classes.MarginTop);
  if(props.marginBottom) headerClass.push(classes.MarginBottom);
  if(props.clicked) headerClass.push(classes.HasClicked)
  return <div onClick={props.clicked} className={headerClass.join(" ")}>{props.children}</div>;
};

export default HeaderBar;
