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

const notiSound = localStorage.getItem("notiSound")
  ? {
      mode: localStorage.getItem("notiSound") === "true",
      volume: localStorage.getItem("notiVolume")
    }
  : null;
const notiMode = localStorage.getItem("notiMode")
  ? { mode: localStorage.getItem("notiMode") }
  : null;
const theme = localStorage.getItem("currentTheme");
const notiType =
  localStorage.getItem("notiTypeOnMax") &&
  localStorage.getItem("notiTypeOnMin") &&
  localStorage.getItem("notiType10Till")
    ? {
        onMax: localStorage.getItem("notiTypeOnMax") === "true",
        onMin: localStorage.getItem("notiTypeOnMin") === "true",
        tenTillMin: localStorage.getItem("notiType10Till") === "true"
      }
    : null;
const notiSettingsLocal = {
  notiSound: notiSound,
  notiMode: notiMode,
  notiType: notiType
};

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

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      this.setState({
        ...this.state,
        unAuthenticatedTheme: "default"
      });
    }
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

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.isAuthenticated !== this.props.isAuthenticated &&
      this.props.isAuthenticated
      // || prevProps.theme !== this.props.theme
    ) {
      this.props.initializeSettings(
        this.props.userId,
        this.props.token,
        notiSettingsLocal,
        theme,
        localStorage.getItem("userKey")
      );
    }
    if (
      this.props.theme !== "default" &&
      this.state.unAuthenticatedTheme === "default"
    ) {
      this.setState({
        ...this.state,
        unAuthenticatedTheme: null
      });
    }
  }

  render() {
    const privacyStatement = this.state.showPrivacyStatement ? (
      <AsyncPrivacy />
    ) : null;
    const termsOfService = this.state.showTermsOfService ? (
      <AsyncTerms />
    ) : null;
    let modalPrivacy = (
      <Modal
        modalClosed={this.closeModal}
        isLegalModal
        show={this.state.showPrivacyStatement}
      >
        {privacyStatement}
      </Modal>
    );
    let modalService = (
      <Modal
        modalClosed={this.closeModal}
        isLegalModal
        show={this.state.showTermsOfService}
      >
        {termsOfService}
      </Modal>
    );

    modalPrivacy = privacyStatement && termsOfService ? null : modalPrivacy;

    let routes = this.props.isAuthenticated ? (
      <Switch>
        <Redirect path="/auth" to="/tracker" />
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
      <Layout
        onLegal={legalDocKey => this.toggleShowLegalHandler(legalDocKey)}
        theme={
          this.state.unAuthenticatedTheme
            ? this.state.unAuthenticatedTheme
            : this.props.theme
        }
      >
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
    token: state.auth.token || localStorage.getItem("token"),
    theme: state.mvp.theme
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    updateCurrentTime: () => dispatch(actions.updateCurrentTime()),
    initializeSettings: (userId, token, notiSettingsLocal, theme, userKey) =>
      dispatch(
        actions.initializeSettings(userId, token, notiSettingsLocal, theme, userKey)
      )
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
