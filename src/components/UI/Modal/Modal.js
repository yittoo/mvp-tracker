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

  // listenerFunc = event => {
  //   if (this.props.onCoordChange && this.props.show) {
  //     const ele = document.getElementById("modalOfMap");
  //     if (ele.offsetLeft !== this.state.x || ele.offsetTop !== this.state.y) {
  //       this.setState({
  //         ...this.state,
  //         x: ele.offsetLeft,
  //         y: ele.offsetTop
  //       });
  //     }
  //   }
  // };

  constructor(props) {
    super(props);
    this.state = {};
    // if (this.props.onCoordChange) {
    //   window.addEventListener("mousemove", this.listenerFunc);
    // }
  }

  componentWillUnmount() {
    // if (this.props.onCoordChange) {
    //   window.removeEventListener("mousemove", this.listenerFunc);
    // }
  }

  componentDidMount() {
    const ele = document.getElementById("modalOfMap");
    if (this.props.onCoordChange && ele) {
      setTimeout(() => {
        this.setState({
          ...this.state,
          x: ele.offsetLeft,
          y: ele.offsetTop
        });
      }, 305);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.props.onCoordChange(this.state.x, this.state.y);
    }
  }

  render() {
    let currentClass = this.props.show
      ? classes.Modal + " " + classes["Modal-Visible"]
      : classes.Modal;
    currentClass = this.props.isLegalModal
      ? currentClass + " " + classes.Legal
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
