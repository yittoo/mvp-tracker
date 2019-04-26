import React, { Component } from "react";

import classes from "./Modal.css";
import Backdrop from "../Backdrop/Backdrop";

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.props.show ||
      nextProps.children !== this.props.children ||
      nextState !== this.state
    );
  }

  listenEsc = event => {
    if (event.which === 27) {
      this.props.modalClosed();
    }
  };

  constructor(props) {
    super(props);
    this.state = {};
    if (this.props.closeMapModal) {
      window.addEventListener("keydown", this.listenEsc);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.show !== this.props.show && this.props.onCoordChange) {
      const ele = document.getElementById("modalOfMap");
      this.setState(
        {
          ...this.state,
          x: ele.offsetLeft,
          y: ele.offsetTop
        },
        () => {
          this.props.onCoordChange(this.state.x, this.state.y);
        }
      );
    }
  }

  componentWillUnmount() {
    if (this.props.closeMapModal) {
      window.removeEventListener("keydown", this.listenEsc);
    }
  }

  render() {
    let currentClass = this.props.show
      ? classes.Modal + " " + classes["Modal-Visible"]
      : classes.Modal;
    currentClass = this.props.isLegalModal
      ? currentClass + " " + classes.Legal
      : currentClass;
    currentClass = this.props.isMapModal
      ? currentClass + " " + classes.MapModal
      : currentClass;
    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div className={currentClass} id={this.props.id}>
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default Modal;
