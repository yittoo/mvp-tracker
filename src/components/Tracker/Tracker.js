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
import Modal from "../UI/Modal/Modal";
import NewMvpForm from "../NewMvpForm/NewMvpForm";
import Spinner from "../UI/Spinner/Spinner";

const AsyncDefaultMvps = asyncComponent(() => {
  return import("./DefaultMvpListTool/DefaultMvpListTool");
});

class Tracker extends Component {
  state = {
    defaultMvpListChosen: 0,
    showNewMvpForm: false,
    newMvpAdded: false
  };

  componentWillMount() {
    this.fetchMvps();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.defaultMvpListChosen !== this.state.defaultMvpListChosen ||
      this.state.newMvpAdded
    ) {
      this.fetchMvps();
    }
  }

  fetchMvps = () => {
    if (this.props.isAuthenticated) {
      this.props.inIt(
        this.props.token,
        this.props.userId,
        this.props.trackerName
      );
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

  toggleNewMvpFormHandler = () => {
    this.setState({
      ...this.state,
      showNewMvpForm: !this.state.showNewMvpForm
    });
  };

  newMvpAddedHandler = () => {
    this.setState({
      ...this.state,
      newMvpAdded: true,
      showNewMvpForm: false
    });
  };

  render() {
    const mvpsArray = this.props.mvps
      ? Object.keys(this.props.mvps).map(mvp => {
          return <MvpEntry key={mvp} id={mvp} mvp={this.props.mvps[mvp]} />;
        })
      : null;

    const saveMvpsToDbBtn = (
      <Button
        clicked={() =>
          this.props.saveMvpsToDb(
            this.props.userId,
            this.props.userKey,
            this.props.token,
            this.props.trackerKey,
            this.props.mvps,
            this.props.trackerName
          )
        }
      >
        Save MvPs
      </Button>
    );

    let noMvpsPlaceholder = mvpsArray ? null : (
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
        <Button
          classes="ButtonDefaultOrCustom"
          clicked={this.toggleNewMvpFormHandler}
        >
          Make my own
        </Button>
      </div>
    );
    noMvpsPlaceholder = this.props.loading ? <Spinner /> : noMvpsPlaceholder;
    const routeToDefault =
      mvpsArray !== null && mvpsArray.length !== 0 ? null : (
        <Route
          path={this.props.match.path + "/default"}
          render={() => (
            <AsyncDefaultMvps
              createNewMvpTracker={mvps =>
                this.props.createNewMvpTracker(
                  this.props.userId,
                  this.props.token,
                  "My Tracker",
                  this.props.userKey,
                  mvps
                )
              }
              isPremium={this.props.isPremium}
              parentUpdated={this.state.defaultMvpListChosen}
              refreshed={this.onRefreshHandler}
            />
          )}
        />
      );
    const newMvpForm = (
      <Modal
        show={this.state.showNewMvpForm}
        modalClosed={this.toggleNewMvpFormHandler}
      >
        <NewMvpForm onNewMvpAdded={this.newMvpAddedHandler} />
      </Modal>
    );

    const newMvpButton = mvpsArray ? (
      <Button classes="NewMvpButton" clicked={this.toggleNewMvpFormHandler}>
        New MvP
      </Button>
    ) : null;

    return (
      <div className={classes.Tracker}>
        {saveMvpsToDbBtn}
        <HeaderBar>MvP Tracker</HeaderBar>
        {mvpsArray}
        {noMvpsPlaceholder}
        {newMvpForm}
        {routeToDefault}
        {newMvpButton}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    mvps: state.mvp.mvps,
    isAuthenticated: state.auth.token !== null,
    isPremium: state.auth.premium,
    userId: state.auth.userId,
    token: state.auth.token,
    loading: state.mvp.loading,
    trackerName: state.mvp.activeTrackerName,
    trackerKey: state.mvp.activeTrackerKey,
    userKey: state.mvp.userKey
  };
};

const mapDispatchToProps = dispatch => {
  return {
    inIt: (token, userId, trackerName) =>
      dispatch(actions.fetchMvpsFromDb(token, userId, trackerName)),
    createNewMvpTracker: (userId, token, trackerName, userKey, mvps) =>
      dispatch(
        actions.createNewMvpTracker(userId, token, trackerName, userKey, mvps)
      ),
    saveMvpsToDb: (userId, userKey, token, trackerKey, mvps, trackerName) =>
      dispatch(
        actions.saveMvpsToDb(
          userId,
          userKey,
          token,
          trackerKey,
          mvps,
          trackerName
        )
      )
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Tracker)
);
