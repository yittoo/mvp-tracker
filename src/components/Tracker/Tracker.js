import React, { Component } from "react";
import classes from "./Tracker.css";
import { connect } from "react-redux";
import { Route, withRouter } from "react-router-dom";
import MvpEntry from "./MvpEntry/MvpEntry";
import HeaderBar from "../UI/HeaderBar/HeaderBar";
import * as actions from "../../store/actions";
import { Link } from "react-router-dom";
import Button from "../UI/Button/Button";
import asyncComponent from "../../hoc/asyncComponent/asyncComponent";

const AsyncDefaultMvps = asyncComponent(() => {
  return import("./DefaultMvpListTool/DefaultMvpListTool");
});

class Tracker extends Component {
  state = {
    defaultMvpListChosen: 0,
    shouldRedirect: false
  };

  componentWillMount() {
    this.fetchMvps();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.defaultMvpListChosen !== this.state.defaultMvpListChosen) {
      this.fetchMvps();
    }
  }

  fetchMvps = () => {
    if (this.props.isAuthenticated) {
      if (this.props.isPremium) {
        // if premium fetch mvps from db by search index query
      } else {
        this.props.inItNoPremium();
      }
    }
  };

  onRefreshHandler = () => {
    this.setState({
      ...this.state,
      defaultMvpListChosen: this.state.defaultMvpListChosen + 1
    });
  };

  onGoToDefaultList = () => {
    this.props.history.replace("/tracker/defaultSetup");
  };

  render() {
    const mvpsArray = this.props.mvps
      ? Object.keys(this.props.mvps).map(mvp => {
          return <MvpEntry key={mvp} id={mvp} mvp={this.props.mvps[mvp]} />;
        })
      : null;
    const noMvpsPlaceholder = mvpsArray ? null : (
      <div className={classes.DefaultPlaceholder}>
        <p>
          Hello, currently there is no registered MVP List. Would you like to
          import default <span>Pre-Renewal</span> or <span>Renewal</span> mvp
          list?
        </p>
        <Link to={this.props.match.path + "/default"}>
          <Button classes="ButtonDefaultOrCustom">
            Choose one of the defaults
          </Button>
        </Link>
        <Link to={this.props.match.path + "/default"}>
          <Button classes="ButtonDefaultOrCustom">
            TODO Make my own (will pop modal for mvp registration form)
          </Button>
        </Link>
      </div>
    );
    const routes = mvpsArray ? null : (
      <Route
        path={this.props.match.path + "/default"}
        render={() => (
          <AsyncDefaultMvps
            parentUpdated={this.state.defaultMvpListChosen}
            refreshed={this.onRefreshHandler}
          />
        )}
      />
    );
    return (
      <div className={classes.Tracker}>
        <HeaderBar>MvP Tracker</HeaderBar>
        {mvpsArray}
        {noMvpsPlaceholder}
        {routes}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    mvps: state.mvp.mvps,
    isAuthenticated: state.auth.token !== null,
    isPremium: state.auth.premium,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    inItNoPremium: () => dispatch(actions.fetchMvpsFromLocal())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Tracker)
);
