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
      isForAllDevicesMode: "",
      isForAllDevicesType: "",
      isForAllDevicesSound: "",
      selectNotificationMvps: "",
      notiType: {
        tenTillMin: false,
        onMin: false,
        onMax: false
      },
      notiSound: false,
      message: null,
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
      if (!this.props.userKey) {
        this.setState({
          ...this.state,
          message:
            "Tracker creation failed due to not being able to identify user identifier, please make sure you have browser cookies and local storage services enabled and refresh the page."
        });
      } else {
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

  mvpNotiModeHandler = event => {
    event.preventDefault();
    if (
      this.state.selectNotificationMvps !== "" &&
      this.state.isForAllDevicesMode !== ""
    ) {
      if (this.state.isForAllDevicesMode === "singleDevice") {
        localStorage.setItem("notiMode", this.state.selectNotificationMvps);
        this.props.saveNotificationSettingsLocal("notiMode", {
          mode: this.state.selectNotificationMvps
        });
      }
      if (this.state.isForAllDevicesMode === "allDevices") {
        this.props.saveNotificationSettingsServer(
          this.props.token,
          this.props.userKey,
          "notiMode",
          { mode: this.state.selectNotificationMvps }
        );
      }
      this.setState({
        ...this.state,
        isForAllDevicesMode: "",
        selectNotificationMvps: "",
        message: "Notification mode updated."
      });
    }
    if (this.state.isForAllDevicesMode === "removeSettings") {
      localStorage.removeItem("notiMode");
      this.setState({
        ...this.state,
        isForAllDevicesMode: "",
        selectNotificationMvps: "",
        message: "Please refresh the page for effects to take place"
      });
    }
  };

  checkboxHandler = checkboxStateId => {
    if (checkboxStateId === "notiSound") {
      this.setState(prevState => ({
        ...prevState,
        notiSound: !prevState.notiSound
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        notiType: {
          ...prevState.notiType,
          [checkboxStateId]: !prevState.notiType[checkboxStateId]
        }
      }));
    }
  };

  mvpNotiTypeHandler = event => {
    event.preventDefault();
    if (this.state.isForAllDevicesType !== "") {
      if (this.state.isForAllDevicesType === "singleDevice") {
        localStorage.setItem("notiType10Till", this.state.notiType.tenTillMin);
        localStorage.setItem("notiTypeOnMin", this.state.notiType.onMin);
        localStorage.setItem("notiTypeOnMax", this.state.notiType.onMax);
        this.props.saveNotificationSettingsLocal("notiType", {
          onMax: this.state.notiType.onMax,
          onMin: this.state.notiType.onMin,
          tenTillMin: this.state.notiType.tenTillMin
        });
      }
      if (this.state.isForAllDevicesType === "allDevices") {
        const itemToCast = {
          onMax: this.state.notiType.onMax,
          onMin: this.state.notiType.onMin,
          tenTillMin: this.state.notiType.tenTillMin
        };
        this.props.saveNotificationSettingsServer(
          this.props.token,
          this.props.userKey,
          "notiType",
          itemToCast
        );
      }
      this.setState({
        ...this.state,
        isForAllDevicesType: "",
        message: "Notification preferences updated."
      });
    }
    if (this.state.isForAllDevicesType === "removeSettings") {
      localStorage.removeItem("notiType10Till");
      localStorage.removeItem("notiTypeOnMin");
      localStorage.removeItem("notiTypeOnMax");
      this.setState({
        ...this.state,
        isForAllDevicesType: "",
        message: "Please refresh the page for effects to take place"
      });
    }
  };

  mvpNotiSoundHandler = event => {
    event.preventDefault();
    if (this.state.isForAllDevicesSound !== "") {
      if (this.state.isForAllDevicesSound === "singleDevice") {
        localStorage.setItem("notiSound", this.state.notiSound);
        this.props.saveNotificationSettingsLocal("notiSound", {
          mode: this.state.notiSound
        });
      }
      if (this.state.isForAllDevicesSound === "allDevices") {
        this.props.saveNotificationSettingsServer(
          this.props.token,
          this.props.userKey,
          "notiSound",
          { mode: this.state.notiSound }
        );
      }
      this.setState({
        ...this.state,
        isForAllDevicesSound: "",
        message: "Notification sound setting updated."
      });
    }
    if (this.state.isForAllDevicesSound === "removeSettings") {
      localStorage.removeItem("notiSound");
      this.setState(prevState => ({
        ...prevState,
        isForAllDevicesSound: "",
        message: "Please refresh the page for effects to take place"
      }));
    }
  };

  mvpDeleteModeHandler = () => {
    localStorage.setItem("mvpDeleteMode", !this.state.mvpDeleteMode);
    this.setState({
      ...this.state,
      mvpDeleteMode: !this.state.mvpDeleteMode
    });
  };

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
          <Button type="submit">Set as Active Tracker</Button>
        </form>
      </div>
    ) : (
      <div className={classes.Section}>No tracker to select</div>
    );

    const notiSettingsProp = this.props.notiSettings;

    const currentNotiData = {
      mode:
        notiSettingsProp.notiMode.mode === "none"
          ? "No Notifications"
          : notiSettingsProp.notiMode.mode === "all"
          ? "All MvPs"
          : "Selected MvPs",
      sound: notiSettingsProp.notiSound.mode ? "On" : "Off"
    };

    const notiModeForm = (
      <div className={classes.Section + " " + classes.Grid}>
        <div className={classes.Left}>
          Current notification mode: {currentNotiData.mode}{" "}
          <span className={colors.LightGray}>
            (Local settings overrides server)
          </span>
        </div>
        <div className={classes.Right + " " + classes.TextAlignRight}>
          <form onSubmit={this.mvpNotiModeHandler}>
            <label>Notificate on:</label>
            <select
              value={this.state.selectNotificationMvps}
              onChange={event =>
                this.handleChange(event, "selectNotificationMvps")
              }
              disabled={this.state.isForAllDevicesMode === "removeSettings"}
            >
              {this.state.isForAllDevicesMode === "removeSettings" ? (
                <option value="">Remove Local</option>
              ) : (
                <React.Fragment>
                  <option value="">Which MvPs</option>
                  <option value="all">All MvPs</option>
                  <option value="custom">Selected MvPs</option>
                  <option value="none">No Notifications</option>
                </React.Fragment>
              )}
            </select>
            <select
              value={this.state.isForAllDevicesMode}
              onChange={event =>
                this.handleChange(event, "isForAllDevicesMode")
              }
            >
              <option value="">Where</option>
              <option value="singleDevice">Just this device</option>
              <option value="allDevices">For this account</option>
              <option value="removeSettings">-Remove Local Settings-</option>
            </select>
            <Button type="submit">Update</Button>
          </form>
        </div>
      </div>
    );

    const notiModeTenTill = notiSettingsProp.notiType.tenTillMin ? (
      <p className={colors.LightGray}>On 10 minutes to spawn: On</p>
    ) : (
      <p className={colors.LightGray}>On 10 minutes to spawn: Off</p>
    );
    const notiModeOnMin = notiSettingsProp.notiType.onMin ? (
      <p className={colors.LightGray}>On minimum time: On</p>
    ) : (
      <p className={colors.LightGray}>On minimum time: Off</p>
    );
    const notiModeOnMax = notiSettingsProp.notiType.onMax ? (
      <p className={colors.LightGray}>On maximum time: On</p>
    ) : (
      <p className={colors.LightGray}>On maximum time: Off</p>
    );

    const currentNotiMode = (
      <div>
        <p>Current Settings:</p>
        {notiModeTenTill}
        {notiModeOnMin}
        {notiModeOnMax}
      </div>
    );

    const notiTypeForm = notiSettingsProp.notiMode.mode !== "none" ? (
      <div className={classes.Section + " " + classes.Grid}>
        <div className={classes.Left}>
          Current notification modes{" "}
          <span className={colors.LightGray}>
            Works only if you have notifications enabled
          </span>
          {currentNotiMode}
        </div>
        <div className={classes.Right + " " + classes.TextAlignRight}>
          <form onSubmit={this.mvpNotiTypeHandler}>
            <label>For:</label>
            <select
              value={this.state.isForAllDevicesType}
              onChange={event =>
                this.handleChange(event, "isForAllDevicesType")
              }
            >
              <option value="">Please Select</option>
              <option value="singleDevice">Just this device</option>
              <option value="allDevices">For this account</option>
              <option value="removeSettings">-Remove Local Settings-</option>
            </select>
            <div>
              <label>On 10 minutes to spawn:</label>
              <input
                disabled={this.state.isForAllDevicesType === "removeSettings"}
                type="checkbox"
                checked={this.state.notiType.tenTillMin}
                onChange={() => this.checkboxHandler("tenTillMin")}
              />
            </div>
            <div>
              <label>On minimum time:</label>
              <input
                disabled={this.state.isForAllDevicesType === "removeSettings"}
                type="checkbox"
                checked={this.state.notiType.onMin}
                onChange={() => this.checkboxHandler("onMin")}
              />
            </div>
            <div>
              <label>On maximum time:</label>
              <input
                disabled={this.state.isForAllDevicesType === "removeSettings"}
                type="checkbox"
                checked={this.state.notiType.onMax}
                onChange={() => this.checkboxHandler("onMax")}
              />
            </div>
            <Button type="submit">Update</Button>
          </form>
        </div>
      </div>
    ) : null;

    const notiSoundForm = notiSettingsProp.notiMode.mode !== "none" ? (
      <div className={classes.Section + " " + classes.Grid}>
        <div className={classes.Left}>
          Play sound with notification: {currentNotiData.sound}
          {"  "}
          <span className={colors.LightGray}>
            Works only if you have notifications enabled
          </span>
        </div>
        <div className={classes.Right + " " + classes.TextAlignRight}>
          <form onSubmit={this.mvpNotiSoundHandler}>
            <label>Notificate on:</label>
            <select
              value={this.state.isForAllDevicesSound}
              onChange={event =>
                this.handleChange(event, "isForAllDevicesSound")
              }
            >
              <option value="">Please Select</option>
              <option value="singleDevice">Just this device</option>
              <option value="allDevices">For this account</option>
              <option value="removeSettings">Remove Local Settings</option>
            </select>
            <div>
              <label>Play sound with notification:</label>
              <input
                disabled={this.state.isForAllDevicesSound === "removeSettings"}
                type="checkbox"
                checked={this.state.notiSound}
                onChange={() => this.checkboxHandler("notiSound")}
              />
            </div>
            <Button type="submit">Update</Button>
          </form>
        </div>
      </div>
    ) : null;

    const addNewTracker = (
      <div className={classes.Section + " " + classes.Grid}>
        <div className={classes.Left}>
          <p>New Tracker:</p>
        </div>
        <div className={classes.Right}>
          <form onSubmit={this.handleCreateTracker}>
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
      </div>
    );

    const deleteTracker = this.props.allTrackers ? (
      <div className={classes.Section + " " + classes.Grid}>
      <div className={classes.Left}>
        Delete Tracker <span className={colors.LightGray}>(Permanently)</span></div>
        <div className={classes.Right}>
          <form  className={classes.FloatRight} onSubmit={this.handleDeleteTracker}>
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
            <Button type="submit">Delete</Button>
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
          <Button clicked={this.mvpDeleteModeHandler}>
            {this.state.mvpDeleteMode ? "Disable" : "Enable"}
          </Button>
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

    const notiToRender = (
      <React.Fragment>
        {notiModeForm}
        {notiTypeForm}
        {notiSoundForm}
      </React.Fragment>
    );

    const contentToRender =
      this.props.authLoading || this.props.mvpLoading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <div className={classes.Profile}>
            {message}
            {changeDefaultTracker}
            {notiToRender}
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
                to delete your account
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
    userKey: state.mvp.userKey || localStorage.getItem("userKey"),
    authLoading: state.auth.loading,
    mvpLoading: state.mvp.loading,
    allTrackers: state.mvp.allTrackers,
    activeTrackerName: state.mvp.activeTrackerName,
    notiSettings: state.mvp.notificationSettings
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
      ),
    saveNotificationSettingsServer: (token, userKey, notiTypeKey, itemToCast) =>
      dispatch(
        actions.saveNotificationSettings(
          token,
          userKey,
          notiTypeKey,
          itemToCast
        )
      ),
    saveNotificationSettingsLocal: (notiTypeKey, itemToCast) =>
      dispatch(actions.saveNotificationsLocal(notiTypeKey, itemToCast))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);