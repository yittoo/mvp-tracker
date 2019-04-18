import React from "react";

import tomb from "../../assets/images/tomb.png";
import classes from "./Images.css";

const Tomb = props => {
  return (
    <div
      className={classes.Tomb}
      style={{
        left: (props.x-10),
        top: (props.y-10)
      }}
    >
      <img src={tomb} alt="Tombstone" />
    </div>
  );
};

export default Tomb;
