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

  componentWillMount() {
    this.fetchMvps(true);
  }

  componentDidMount() {
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
        this.props.trackerName,
        shouldSpinner
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
        updatedMvps
      );
    }
  };

  render() {
    const mvpsArray = this.props.mvps
      ? Object.keys(this.props.mvps).map(mvp => {
          return <MvpEntry key={mvp} id={mvp} mvp={this.props.mvps[mvp]} />;
        })
      : null;

    // const saveMvpsToDbBtn = (
    //   <Button
    //     clicked={() =>
    //       this.props.saveAllMvpsHandler(
    //         this.props.userKey,
    //         this.props.token,
    //         this.props.trackerKey,
    //         this.props.mvps,
    //         this.props.trackerName
    //       )
    //     }
    //   >
    //     Save MvPs
    //   </Button>
    // );
    // THERE IS AUTO SAVE ON MVP KILLED SO IT IS NEEDLESS ATM

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

    const routeToDefault =
      mvpsArray !== null && mvpsArray.length !== 0 ? null : (
        <Route
          path={this.props.match.path + "/default"}
          render={() => (
            <AsyncDefaultMvps
              createNewTracker={mvps =>
                this.props.createNewTracker(
                  this.props.userId,
                  this.props.token,
                  "My Tracker",
                  this.props.userKey,
                  mvps
                )
              }
              isPremium={this.props.isPremium}
              parentUpdated={this.state.defaultMvpListChosen}
              onRefreshed={this.onRefreshHandler}
            />
          )}
        />
      );
    const mainContentToRender = mvpsArray ? (
      <React.Fragment>
        <LastUpdated lastTime={this.props.lastUpdated} />
        {mvpsArray}
      </React.Fragment>
    ) : null;

    const newMvpForm = (
      <Modal
        show={this.state.showNewMvpForm}
        modalClosed={this.toggleNewMvpFormHandler}
      >
        <NewMvpForm
          onNewMvpAdded={updatedMvps => this.newMvpAddedHandler(updatedMvps)}
          onRefreshed={this.onRefreshHandler}
        />
      </Modal>
    );

    const newMvpButton = mvpsArray ? (
      <Button classes="NewMvpButton" clicked={this.toggleNewMvpFormHandler}>
        New MvP
      </Button>
    ) : null;

    return (
      <div className={classes.Tracker}>
        <HeaderBar>{this.props.trackerName ? this.props.trackerName : "MvP Tracker"}</HeaderBar>
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
    userKey: state.mvp.userKey,
    lastUpdated: state.mvp.lastUpdated
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMvpsFromDb: (token, userId, trackerName, isLoader) =>
      dispatch(actions.fetchMvpsFromDb(token, userId, trackerName, isLoader)),
    createNewTracker: (userId, token, trackerName, userKey, mvps) =>
      dispatch(
        actions.createNewMvpTracker(userId, token, trackerName, userKey, mvps)
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
