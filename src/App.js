import React, { Component } from "react";
import "./App.css";

import MvpTracker from "./containers/MvpTracker/MvpTracker";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import './App.css';
import Layout from './hoc/Layout/Layout';

class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path="/tracker" component={MvpTracker} />
        <Redirect path="/" to="/tracker" />
      </Switch>
    );
    return <Layout>{routes}</Layout>;
  }
}

export default connect(
  null,
  null
)(App);
