import React, { useState } from "react";
import classes from "./Notification.css";
import HwFemale from "../Images/HwFemale";

const Notification = props => {
  const [touched, setTouched] = useState(false);

  if (props.show && !touched) {
    setTouched(true);
  }

  let notiClasses = [classes.Notification];
  if (props.show && touched) {
    notiClasses.push(classes.Show);
  } else if (touched) {
    notiClasses.push(classes.Hide);
  }
  
  return (
    <div className={notiClasses.join(" ")}>
      <div className={classes.NotiText}>{props.children}</div>
      <div className={classes.NotiImage}>
        <HwFemale />
      </div>
    </div>
  );
};

export default Notification;
