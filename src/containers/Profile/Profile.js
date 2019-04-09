import React, { Component } from "react";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Profile.css";
import { connect } from "react-redux";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions";
import HeaderBar from "../../components/UI/HeaderBar/HeaderBar";
import asyncComponent from "../../hoc/asyncComponent/asyncComponent";
import colors from "../../components/UI/Colors/Colors.css";

const AsyncDefaultMvps = asyncComponent(() => {
  return import("../../components/Tracker/DefaultMvpListTool/DefaultMvpListTool");
});

class Profile extends Component {
  componentDidMount() {
    this.props.fetchUserKey(this.props.userId, this.props.token);
  }

  constructor(props) {
    super(props);
    this.state = {
      deleteValue: "",
      trackerName: "",
      selectDefaultTrackerKey: "",
      message: null,
      importDefault: false,
      refreshComponent: 0,
      resetBtnDisabled: false,
      mvpDeleteMode: localStorage.getItem("mvpDeleteMode") === "true"
    };
  }

  handleChange = (event, area) => {
    let value = event.target.value;
    if (area === "trackerName") {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    this.setState({ ...this.state, [area]: value });
  };

  chooseDefaultHandler = event => {
    event.preventDefault();
    if (this.state.selectDefaultTrackerKey !== "") {
      localStorage.setItem(
        "activeTrackerKey",
        this.state.selectDefaultTrackerKey
      );
      this.setState({
        ...this.state,
        message: "Default Tracker Changed",
        selectDefaultTrackerKey: ""
      });
    }
  };

  handleCreateTracker = event => {
    event.preventDefault();
    if (this.state.trackerName !== "") {
      this.props.createNewTracker(
        this.props.userId,
        this.props.token,
        this.state.trackerName,
        this.props.userKey,
        null
      );
      this.setState({
        ...this.state,
        message: "Tracker Created",
        trackerName: ""
      });
    }
  };

  handleDeleteTracker = event => {
    event.preventDefault();
    if (this.state.deleteValue !== "") {
      this.setState({
        ...this.state,
        message: "Tracker Deleted",
        deleteValue: "",
        refreshComponent: this.state.refreshComponent + 1
      });
      this.props.deleteTracker(
        this.props.userKey,
        this.state.deleteValue,
        this.props.token,
        this.props.userId
      );
    }
  };

  mvpDeleteModeHandler = () => {
    localStorage.setItem("mvpDeleteMode", !this.state.mvpDeleteMode)
    this.setState({
      ...this.state,
      mvpDeleteMode: !this.state.mvpDeleteMode
    })
  }

  resetBtnHandler = () => {
    this.props.resetPassword(localStorage.getItem("loggedEmail"));
    this.setState({
      ...this.state,
      resetBtnDisabled: true,
      message: "Reset password e-mail has been sent"
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props || nextState !== this.state) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const message = this.state.message ? (
      <p className={classes.Message}>{this.state.message}</p>
    ) : null;

    const currentChosenTracker =
      this.props.activeTrackerName ||
      localStorage.getItem("activeTrackerName") ? (
        <span>
          Current active tracker:{" "}
          <span className={classes.LineBreakSpan}>
            "
            {this.props.activeTrackerName ||
              localStorage.getItem("activeTrackerName")}
            "
          </span>
        </span>
      ) : null;

    const changeDefaultTracker = this.props.allTrackers ? (
      <div className={classes.Section}>
        {currentChosenTracker}
        <form
          className={classes.FloatRight}
          onSubmit={this.chooseDefaultHandler}
        >
          <select
            value={this.state.selectDefaultTrackerKey}
            onChange={event =>
              this.handleChange(event, "selectDefaultTrackerKey")
            }
          >
            <option value="">Please Select</option>
            {this.props.allTrackers.map(tracker => (
              <option key={tracker.trackerKey} value={tracker.trackerKey}>
                {tracker.trackerName}
              </option>
            ))}
          </select>
          <Button type="submit">Set as Default Tracker</Button>
        </form>
      </div>
    ) : (
      <div className={classes.Section}>No tracker to select</div>
    );

    const addNewTracker = (
      <div className={classes.Section}>
        <form onSubmit={this.handleCreateTracker}>
          <label>New Tracker: </label>
          <div className={classes.FloatRight}>
            <input
              value={this.state.trackerName}
              type="text"
              placeholder="Tracker Name"
              onChange={event => this.handleChange(event, "trackerName")}
            />
            <Button type="submit">Create</Button>
          </div>
        </form>
      </div>
    );

    const deleteTracker = this.props.allTrackers ? (
      <div className={classes.Section}>
        Delete Tracker <span className={colors.LightGray}>(Permanently)</span>
        <div className={classes.FloatRight}>
          <form onSubmit={this.handleDeleteTracker}>
            <select
              value={this.state.deleteValue}
              onChange={event => this.handleChange(event, "deleteValue")}
            >
              <option value="">Please Select</option>
              {this.props.allTrackers.map(tracker => (
                <option key={tracker.trackerKey} value={tracker.trackerKey}>
                  {tracker.trackerName}
                </option>
              ))}
            </select>
            <Button type="submit">DELETE</Button>
          </form>
        </div>
      </div>
    ) : (
      <div className={classes.Section}>No tracker to delete</div>
    );

    const mvpDeleteModeBtn = (
      <div className={classes.Section}>
        Enable/Disable MvP Deleting Mode{" "}
        <div className={classes.FloatRight}>
          <Button clicked={this.mvpDeleteModeHandler}>{this.state.mvpDeleteMode ? "Disable" : "Enable"}</Button>
        </div>
      </div>
    );

    const passwordReset = (
      <div className={classes.Section}>
        Send Reset Password Email
        <div className={classes.FloatRight}>
          <Button
            clicked={this.resetBtnHandler}
            disabled={this.state.resetBtnDisabled}
          >
            Reset
          </Button>
        </div>
      </div>
    );

    const contentToRender =
      this.props.authLoading || this.props.mvpLoading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <div className={classes.Profile}>
            {message}
            {/* {currentChosenTracker} */}
            {changeDefaultTracker}
            {addNewTracker}
            {deleteTracker}
            {mvpDeleteModeBtn}
            {passwordReset}
            <div className={classes.Section}>
              Delete Account{" "}
              <span
                className={
                  classes.FloatRight +
                  " " +
                  classes.LineBreakSpan +
                  " " +
                  colors.LightGray
                }
              >
                Not implemented yet contact suggest@mvp-ro.com with your email
                to delete your accound
              </span>
            </div>
          </div>
        </React.Fragment>
      );

    return (
      <React.Fragment>
        <div className={classes.Container}>
          <HeaderBar>Profile Section</HeaderBar>
          {contentToRender}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    trackerKey: state.mvp.activeTrackerKey,
    token: state.auth.token,
    userId: state.auth.userId,
    userKey: state.mvp.userKey,
    authLoading: state.auth.loading,
    mvpLoading: state.mvp.loading,
    allTrackers: state.mvp.allTrackers,
    activeTrackerName: state.mvp.activeTrackerName
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetPassword: email => dispatch(actions.sendPasswordReset(email)),
    deleteTracker: (userKey, trackerKey, token, userId) =>
      dispatch(actions.deleteTracker(userKey, trackerKey, token, userId)),
    clearAuthMessage: () => dispatch(actions.clearAuthMessage()),
    clearMvpMessage: () => dispatch(actions.clearMvpMessage()),
    fetchUserKey: (userId, token) =>
      dispatch(actions.fetchUserKey(userId, token)),
    createNewTracker: (userId, token, trackerName, userKey, mvps) =>
      dispatch(
        actions.createNewMvpTracker(userId, token, trackerName, userKey, mvps)
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
