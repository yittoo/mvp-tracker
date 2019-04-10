import React, { Component } from "react";

import classes from "./Modal.css";
import Backdrop from "../Backdrop/Backdrop";

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
  }

  render() {
    let currentClass = this.props.show
      ? classes.Modal + " " + classes["Modal-Visible"]
      : classes.Modal;
    currentClass = this.props.isLegalModal ? currentClass + " " + classes.Legal : currentClass
    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div className={currentClass}>{this.props.children}</div>
      </React.Fragment>
    );
  }
}

export default Modal;
