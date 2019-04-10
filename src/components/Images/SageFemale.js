import React from "react";

import sage_female from "../../assets/images/sage_female.png";
import classes from "./Images.css";

const SageFemale = (props) => {
  return (
    <div className={classes.SageFemale}>
      <img src={sage_female} alt="Sage Female" />
    </div>
  );
};

export default SageFemale;
