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
import Modal from "./components/UI/Modal/Modal";

const asyncTracker = asyncComponent(() => {
  return import("./containers/MvpTracker/MvpTracker");
});

const AsyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});

const asyncLogout = asyncComponent(() => {
  return import("./containers/Auth/Logout/Logout");
});

const asyncProfile = asyncComponent(() => {
  return import("./containers/Profile/Profile");
});

const AsyncPrivacy = asyncComponent(() => {
  return import("./components/PrivacyAndTos/PrivacyPolicy");
});
const AsyncTerms = asyncComponent(() => {
  return import("./components/PrivacyAndTos/TermsOfService");
});

class App extends Component {
  state = {
    showPrivacyStatement: false,
    showTermsOfService: false
  };
  componentWillMount() {
    this.interval = setInterval(this.props.updateCurrentTime, 10000);
    this.props.onTryAutoSignup();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  toggleShowLegalHandler = legalDocKey => {
    this.setState({
      ...this.state,
      [legalDocKey]: !this.state[legalDocKey]
    });
  };

  closeModal = () => {
    this.setState({
      ...this.state,
      showPrivacyStatement: false,
      showTermsOfService: false
    });
  };

  render() {
    const privacyStatement = this.state.showPrivacyStatement ? (
      <AsyncPrivacy />
    ) : null;
    const termsOfService = this.state.showTermsOfService ? (
      <AsyncTerms />
    ) : null;
    let modalPrivacy = (
      <Modal modalClosed={this.closeModal} isLegalModal show={this.state.showPrivacyStatement}>{privacyStatement}</Modal>
    );
    let modalService = (
      <Modal modalClosed={this.closeModal} isLegalModal show={this.state.showTermsOfService}>{termsOfService}</Modal>
    );

    modalPrivacy = privacyStatement && termsOfService ? null : modalPrivacy;

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
        <Route
          path="/auth"
          render={() => (
            <AsyncAuth
              onLegal={legalDocKey => this.toggleShowLegalHandler(legalDocKey)}
            />
          )}
        />
        <Route path="/" component={IndexPage} />
      </Switch>
    );
    return (
      <Layout onLegal={legalDocKey => this.toggleShowLegalHandler(legalDocKey)}>
        {modalPrivacy}
        {modalService}
        {routes}
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    userId: state.mvp.userId || localStorage.getItem("userId"),
    token: state.auth.token || localStorage.getItem("token")
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    updateCurrentTime: () => dispatch(actions.updateCurrentTime()),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
