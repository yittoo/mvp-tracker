import React, { Component } from "react";
import "./App.css";

import MvpTracker from "./containers/MvpTracker/MvpTracker";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import classes from './App.css';

class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path="/tracker" component={MvpTracker} />
        <Redirect path="/" to="/tracker" />
      </Switch>
    );
    return <div className={classes.App}>{routes}</div>;
  }
}

export default connect(
  null,
  null
)(App);
