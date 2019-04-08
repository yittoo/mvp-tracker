import React, { Component } from "react";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Profile.css";
import { connect } from "react-redux";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions";
import HeaderBar from "../../components/UI/HeaderBar/HeaderBar";
import asyncComponent from "../../hoc/asyncComponent/asyncComponent";

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
      importDefault: false
    };
  }

  handleChange = (event, area) => {
    this.setState({ ...this.state, [area]: event.target.value });
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
        deleteValue: ""
      });
      this.props.deleteTracker(
        this.props.userKey,
        this.state.deleteValue,
        this.props.token,
        this.props.userId
      );
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps !== this.props || nextState !== this.state){
      return true;
    } else {
      return false;
    }
  }

  render() {
    const message = this.state.message ? (
      <p className={classes.Message}>{this.state.message}</p>
    ) : null;

    // const currentChosenTracker = this.props.activeTrackerName || localStorage.getItem("activeTrackerName") ? (
    //   <div>
    //     <h2>Current active tracker: "{this.props.activeTrackerName || localStorage.getItem("activeTrackerName")}"</h2>
    //   </div>
    // ) : null;

    const changeDefaultTracker = this.props.allTrackers ? (
      <div className={classes.Section}>
        <form onSubmit={this.chooseDefaultHandler}>
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
          <Button type="submit">Change Default Tracker</Button>
        </form>
      </div>
    ) : (
      <div className={classes.Section}>No tracker to select</div>
    );

    const addNewTracker = (
      <div className={classes.Section}>
        <form onSubmit={this.handleCreateTracker}>
          <label>Tracker Name: </label>
          <input
            value={this.state.trackerName}
            type="text"
            onChange={event => this.handleChange(event, "trackerName")}
          />{" "}
          <Button type="submit">Create Tracker</Button>
        </form>
      </div>
    );

    const deleteTracker = this.props.allTrackers ? (
      <div className={classes.Section}>
        Delete Tracker (CAN'T BE UNDONE)
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
    ) : (
      <div className={classes.Section}>No tracker to delete</div>
    );

    const passwordReset = (
      <div className={classes.Section}>
        Send Reset Password Email{" "}
        <Button
          clicked={() =>
            this.props.resetPassword(localStorage.getItem("loggedEmail"))
          }
        >
          Reset
        </Button>
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
            {passwordReset}
            <p>Delete Account</p>
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
