import React, { Component } from "react";
import "./App.css";

import { connect } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import { Redirect } from "react-router";
import "./App.css";
import Layout from "./hoc/Layout/Layout";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
import * as actions from "./store/actions";
import IndexPage from "./containers/Index/Index";

const asyncTracker = asyncComponent(() => {
  return import("./containers/MvpTracker/MvpTracker");
});

const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});

const asyncLogout = asyncComponent(() => {
  return import("./containers/Auth/Logout/Logout");
});

const asyncProfile = asyncComponent(() => {
  return import("./containers/Profile/Profile")
})

class App extends Component {
  componentWillMount() {
    this.interval = setInterval(this.props.updateCurrentTime, 10000);
  }

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let routes = this.props.isAuthenticated ? (
      <Switch>
        <Redirect path="/auth" to="/" />
        <Route path="/tracker" component={asyncTracker} />
        <Route path="/profile" component={asyncProfile} />
        <Route path="/logout" component={asyncLogout} />
        <Route path="/" component={IndexPage} />
      </Switch>
    ) : (
      <Switch>
        <Route path="/auth" component={asyncAuth} />
        <Route path="/" component={IndexPage} />
      </Switch>
    );
    return <Layout>{routes}</Layout>;
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    updateCurrentTime: () => dispatch(actions.updateCurrentTime())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
