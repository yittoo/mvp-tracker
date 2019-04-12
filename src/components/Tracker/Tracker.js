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
import { clearInterval } from "timers";
import LastUpdated from "./LastUpdated/LastUpdated";

const AsyncDefaultMvps = asyncComponent(() => {
  return import("./DefaultMvpListTool/DefaultMvpListTool");
});

class Tracker extends Component {
  state = {
    defaultMvpListChosen: 0,
    showNewMvpForm: false,
    newMvpAdded: false
  };

  componentDidMount() {
    this.fetchMvps(true);
    let fetchInterval = setInterval(() => this.fetchMvps(false), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchInterval);
  }

  fetchMvps = shouldSpinner => {
    if (this.props.isAuthenticated) {
      this.props.fetchMvpsFromDb(
        this.props.token,
        this.props.userId,
        localStorage.getItem("activeTrackerName"),
        shouldSpinner,
        localStorage.getItem("activeTrackerKey")
      );
    }
  };

  onRefreshHandler = () => {
    this.setState({
      ...this.state,
      defaultMvpListChosen: this.state.defaultMvpListChosen + 1
    });
  };

  toggleFormHandler = formStateName => {
    this.setState({
      ...this.state,
      [formStateName]: !this.state[formStateName]
    });
  };

  newMvpAddedHandler = updatedMvps => {
    this.setState({
      ...this.state,
      newMvpAdded: true,
      showNewMvpForm: false
    });
    if (this.props.trackerName && this.props.trackerKey) {
      this.props.saveMvpsToDbAndFetch(
        this.props.userId,
        this.props.userKey,
        this.props.token,
        this.props.trackerKey,
        updatedMvps,
        this.props.trackerName
      );
    } else {
      this.props.createNewTracker(
        this.props.userId,
        this.props.token,
        "My Tracker",
        this.props.userKey,
        updatedMvps,
        null
      );
    }
  };

  notificationHandler = notiObj => {
    // check current noti types compare and send noti if it allows
    // console.log(notiObj) TODO
  };

  render() {
    let sortableMvpArr = [];
    for (let mvpKey in this.props.mvps) {
      sortableMvpArr.push([
        this.props.mvps[mvpKey],
        this.props.mvps[mvpKey].minTillSpawn,
        mvpKey
      ]);
    }

    sortableMvpArr.sort(function(a, b) {
      const compare1 = isNaN(a[1]) ? 99999999 : a[1];
      const compare2 = isNaN(b[1]) ? 99999999 : b[1];
      return compare1 - compare2;
    });

    let mvpsArrToRender = [];
    sortableMvpArr.forEach(orderedMvpPair => {
      mvpsArrToRender.push(
        <MvpEntry
          onNotificate={noti => this.notificationHandler(noti)}
          key={orderedMvpPair[2]}
          id={orderedMvpPair[2]}
          mvp={orderedMvpPair[0]}
        />
      );
    });

    // TODO handle notifications prop above

    let noMvpsPlaceholder = mvpsArrToRender.length ? null : (
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
          clicked={() => this.toggleFormHandler("showNewMvpForm")}
        >
          Make my own
        </Button>
      </div>
    );

    const routeToDefault =
      mvpsArrToRender !== null && mvpsArrToRender.length !== 0 ? null : (
        <Route
          path={this.props.match.path + "/default"}
          render={() => (
            <AsyncDefaultMvps
              createNewTracker={mvps =>
                this.props.createNewTracker(
                  this.props.userId,
                  this.props.token,
                  this.props.trackerName || "My Tracker",
                  this.props.userKey,
                  mvps,
                  this.props.trackerKey
                )
              }
              isPremium={this.props.isPremium}
              parentUpdated={this.state.defaultMvpListChosen}
              onRefreshed={this.onRefreshHandler}
            />
          )}
        />
      );
    const mainContentToRender = mvpsArrToRender.length ? (
      <React.Fragment>
        <LastUpdated
          lastTime={this.props.lastUpdated}
          trackerName={this.props.trackerName}
        />
        {mvpsArrToRender}
      </React.Fragment>
    ) : null;

    const newMvpForm = (
      <Modal
        show={this.state.showNewMvpForm}
        modalClosed={() => this.toggleFormHandler("showNewMvpForm")}
      >
        <NewMvpForm
          onNewMvpAdded={updatedMvps => this.newMvpAddedHandler(updatedMvps)}
          onRefreshed={this.onRefreshHandler}
        />
      </Modal>
    );

    const newMvpButton = mvpsArrToRender.length ? (
      <Button
        classes="NewMvpButton"
        clicked={() => this.toggleFormHandler("showNewMvpForm")}
      >
        New MvP
      </Button>
    ) : null;

    return (
      <div className={classes.Tracker}>
        <HeaderBar>
          {this.props.trackerName ? this.props.trackerName : "MvP Tracker"}
        </HeaderBar>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {mainContentToRender}
            {noMvpsPlaceholder}
            {newMvpForm}
            {routeToDefault}
            {newMvpButton}
          </React.Fragment>
        )}
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
    userKey: state.mvp.userKey || localStorage.getItem("userKey"),
    lastUpdated: state.mvp.lastUpdated
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMvpsFromDb: (token, userId, trackerName, isLoader, trackerKey) =>
      dispatch(
        actions.fetchMvpsFromDb(
          token,
          userId,
          trackerName,
          isLoader,
          trackerKey
        )
      ),
    createNewTracker: (userId, token, trackerName, userKey, mvps, trackerKey) =>
      dispatch(
        actions.createNewMvpTracker(
          userId,
          token,
          trackerName,
          userKey,
          mvps,
          trackerKey
        )
      ),
    saveMvpsToDbAndFetch: (
      userId,
      userKey,
      token,
      trackerKey,
      mvps,
      trackerName
    ) =>
      dispatch(
        actions.saveMvpsToDbAndFetch(
          userId,
          userKey,
          token,
          trackerKey,
          mvps,
          trackerName
        )
      ),
    saveAllMvpsHandler: (userKey, token, trackerKey, mvps, trackerName) =>
      dispatch(
        actions.saveAllMvpsHandler(
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
