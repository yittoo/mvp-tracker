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
import LastUpdated from "./LastUpdated/LastUpdated";
import Notification from "../Notification/Notification";
import noti_sound_url from "../../assets/sounds/noti_initial.mp3";
import asyncMap from "../../hoc/asyncMap/asyncMap";

const AsyncDefaultMvps = asyncComponent(() => {
  return import("./DefaultMvpListTool/DefaultMvpListTool");
});

class Tracker extends Component {
  state = {
    defaultMvpListChosen: 0,
    showNewMvpForm: false,
    newMvpAdded: false,
    notiArr: [],
    mapToRender: null,
    mvpViewMode: localStorage.getItem("mvpViewMode") || "compact"
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps !== this.props ||
      nextState.defaultMvpListChosen !== this.state.defaultMvpListChosen ||
      nextState.showNewMvpForm !== this.state.showNewMvpForm ||
      nextState.newMvpAdded !== this.state.newMvpAdded ||
      nextState.notiArr !== this.state.notiArr ||
      nextState.mapToRender !== this.state.mapToRender ||
      nextState.tombPositioningState !== this.state.tombPositioningState
    ) {
      return true;
    } else {
      return false;
    }
  }

  constructor(props) {
    super(props);
    this.fetchMvps(true);
    this.fetchAllMvpsInterval = window.setInterval(
      () => this.fetchMvps(false),
      60000
    );
  }

  componentWillUnmount() {
    window.clearInterval(this.fetchAllMvpsInterval);
  }

  fetchMvps = shouldSpinner => {
    if (this.props.isAuthenticated) {
      this.props.fetchMvpsFromDb(
        this.props.token,
        this.props.userId,
        localStorage.getItem("activeTrackerName"),
        shouldSpinner,
        localStorage.getItem("activeTrackerKey"),
        localStorage.getItem("userKey") || this.props.userKey
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

  newMvpAddedHandler = (updatedMvps, mvpName) => {
    this.setState({
      ...this.state,
      newMvpAdded: true,
      showNewMvpForm: false
    });
    if (this.props.trackerName && this.props.trackerKey) {
      const newLog = {
        date: new Date(),
        payload: mvpName,
        nickname: localStorage.getItem("nickname").substring(0, 36),
        type: "A"
      };
      this.props.saveMvpsToDbAndFetch(
        this.props.userId,
        this.props.userKey,
        this.props.token,
        this.props.trackerKey,
        updatedMvps,
        this.props.trackerName,
        this.props.logs,
        newLog
      );
    } else {
      this.props.createNewTracker(
        this.props.userId,
        this.props.token,
        "My Tracker",
        this.props.userKey,
        updatedMvps,
        null,
        null
      );
    }
  };

  pushNotiToArr = notiObj => {
    setTimeout(() => {
      let notiArr = [...this.state.notiArr];
      notiArr.push(notiObj);
      if (this.props.notiSettings.notiSound.mode && !this.state.playedSound) {
        let audio = new Audio(noti_sound_url);
        audio.volume = this.props.notiSettings.notiSound.volume || 0.5;
        audio.play().catch(err => {
          return;
        });
      }
      this.setState(prevState => ({
        ...prevState,
        notiArr: notiArr,
        playedSound: true
      }));
      setTimeout(() => {
        let notiArrToSplice = [...this.state.notiArr];
        notiArrToSplice.splice(0, 1);
        this.setState(prevState => ({
          ...prevState,
          notiArr: notiArrToSplice,
          playedSound: false
        }));
      }, 10000);
    }, Math.random() * 300);
  };

  notificationHandler = notiObj => {
    if (notiObj.type === "onMax" && this.props.notiSettings.notiType.onMax) {
      this.pushNotiToArr(notiObj);
    }
    if (notiObj.type === "onMin" && this.props.notiSettings.notiType.onMin) {
      this.pushNotiToArr(notiObj);
    }
    if (
      notiObj.type === "tenTillMin" &&
      this.props.notiSettings.notiType.tenTillMin
    ) {
      this.pushNotiToArr(notiObj);
    }
  };

  toggleMapHandler = (mvp, mvpKey, mapName) => {
    if (mapName) {
      this.setState(
        {
          ...this.state,
          mapToRender: asyncMap(mapName),
          mvpKeyOfMap: mvpKey,
          mvpOfMap: mvp
        },
        () => {
          setTimeout(() => {
            if (
              this.state.mvpOfMap.tombRatioX &&
              this.state.mvpOfMap.tombRatioY
            ) {
              this.setTombHandler(
                this.state.mvpOfMap.tombRatioX,
                this.state.mvpOfMap.tombRatioY
              );
            }
          }, 340);
        }
      );
    } else {
      this.setState({
        ...this.state,
        mapToRender: null,
        mvpKeyOfMap: null,
        mvpOfMap: null,
        tombPositioningState: null
      });
    }
  };

  closeMapModal = () => {
    this.setState({
      ...this.setState,
      mapToRender: null,
      mvpKeyOfMap: null,
      mvpOfMap: null,
      tombPositioningState: null
    });
  };

  importCoordinatesFromChild = (childName, x, y, mouseX, mouseY) => {
    if (childName === "Modal") {
      this.setState({
        ...this.state,
        modalX: x,
        modalY: y
      });
    } else if (childName === "Map") {
      this.setState({
        ...this.state,
        mapX: x,
        mapY: y,
        mouseX: mouseX,
        mouseY: mouseY
      });
    }
  };

  saveTombHandler = () => {
    const height = 250,
      width = 250;
    const tombRatioX =
      (this.state.mouseX - (this.state.modalX + this.state.mapX)) / width;
    const tombRatioY =
      (this.state.mouseY - (this.state.modalY + this.state.mapY)) / height;
    const mvpToCast = {
      ...this.state.mvpOfMap,
      tombRatioX: tombRatioX,
      tombRatioY: tombRatioY
    };
    this.props.saveSingleMvpToDb(
      null,
      this.state.mvpKeyOfMap,
      this.props.userKey,
      this.props.token,
      this.props.trackerKey,
      mvpToCast,
      "saveTomb",
      mvpToCast.note
    );
    this.saveLogsHandler("T", mvpToCast.name);
    this.setTombHandler(tombRatioX, tombRatioY);
  };

  setTombHandler = (tombRatioX, tombRatioY) => {
    const tombPositioning =
      this.state.mvpKeyOfMap && this.props.mvps && tombRatioX && tombRatioY
        ? {
            tombX: this.state.mapX + 250 * tombRatioX,
            tombY: this.state.mapY + 250 * tombRatioY
          }
        : null;
    this.setState({
      ...this.state,
      tombPositioningState: tombPositioning
    });
  };

  // type equals "M" for message sent, "A" for mvp added, "L" for mvpKilled log or undo log, "D" for mvp deleted
  saveLogsHandler = (type, payload) => {
    const newLog = {
      date: new Date(),
      payload: payload,
      nickname: localStorage.getItem("nickname").substring(0, 36),
      type: type
    };
    this.props.saveLogs(
      this.props.userKey,
      this.props.token,
      this.props.trackerKey,
      this.props.logs,
      newLog
    );
  };

  render() {
    let sortableMvpArr = [];
    for (let mvpKey in this.props.mvps) {
      sortableMvpArr.push([
        this.props.mvps[mvpKey],
        this.props.mvps[mvpKey].minTillSpawn,
        mvpKey,
        this.props.mvps[mvpKey].timeKilled
      ]);
    }

    sortableMvpArr.sort(function(a, b) {
      const hoursSinceActionA =
        (Date.now() - new Date(a[3]).getTime()) / (1000 * 60 * 60);
      const hoursSinceActionB =
        (Date.now() - new Date(b[3]).getTime()) / (1000 * 60 * 60);
      const compare1 = isNaN(a[1]) || hoursSinceActionA > 4 ? 99999999 : a[1];
      const compare2 = isNaN(b[1]) || hoursSinceActionB > 4 ? 99999999 : b[1];
      return compare1 - compare2;
    });

    let mvpsArrToRender = [];
    sortableMvpArr.forEach(orderedMvpPair => {
      mvpsArrToRender.push(
        <MvpEntry
          mvpViewMode={this.state.mvpViewMode}
          onNotificate={noti => this.notificationHandler(noti)}
          key={orderedMvpPair[2]}
          id={orderedMvpPair[2]}
          mvp={orderedMvpPair[0]}
          onSaveLogs={(type, payload) => this.saveLogsHandler(type, payload)}
          onMapOpen={(mvp, mvpKey, mapName) =>
            this.toggleMapHandler(mvp, mvpKey, mapName)
          }
        />
      );
    });

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
                  this.props.trackerKey,
                  null
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
        <div
          className={
            this.state.mvpViewMode === "compact"
              ? classes.LegendCompact
              : classes.LegendWide
          }
        >
          <div className={classes.LegendMvpName}>
            MvP Name<span className={classes.LegendNameGuideline}> [?]</span>
          </div>
          <div className={classes.LegendBaseTime}>Base Spawn</div>
          <div className={classes.LegendMapName}>
            Map<span className={classes.LegendMapGuideline}> [?]</span>
          </div>
          <div className={classes.LegendTillSpawn}>Till Spawn</div>
          <div className={classes.LegendActions}>Actions</div>
        </div>
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
          onNewMvpAdded={(updatedMvps, mvpName) =>
            this.newMvpAddedHandler(updatedMvps, mvpName)
          }
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

    const notiArrToRender = (
      <Notification
        show={this.state.notiArr ? this.state.notiArr.length : null}
      >
        {this.state.notiArr
          ? this.state.notiArr.map(notiContent => {
              return (
                <p key={notiContent.mvpKey}>
                  {notiContent.type !== "onMin"
                    ? notiContent.type === "onMax"
                      ? "Maximum time of "
                      : "Ten minutes till "
                    : "Minimum time of "}
                  <em>
                    {this.props.mvps
                      ? this.props.mvps[notiContent.mvpKey].name
                      : null}
                  </em>
                  {notiContent.type === "tenTillMin"
                    ? "'s minimum spawn time"
                    : " is here"}
                </p>
              );
            })
          : null}
      </Notification>
    );

    const Map = this.state.mapToRender ? this.state.mapToRender : null;

    const mapToRender = (
      <Modal
        onCoordChange={(x, y) => this.importCoordinatesFromChild("Modal", x, y)}
        modalClosed={this.toggleMapHandler}
        closeMapModal={this.closeMapModal}
        show={this.state.mapToRender}
        id="modalOfMap"
        isMapModal
      >
        {Map ? (
          <React.Fragment>
            <h4
              style={{
                marginBottom: 10,
                marginTop: 0,
                textAlign: "center",
                color: "#2980b9"
              }}
            >
              Click map to add tomb
            </h4>
            <Map
              onCoordChange={(mapX, mapY, mouseX, mouseY) =>
                this.importCoordinatesFromChild(
                  "Map",
                  mapX,
                  mapY,
                  mouseX,
                  mouseY
                )
              }
              id="mapImgInModal"
              onSaveTomb={this.saveTombHandler}
              tombCoordinates={
                this.state.tombPositioningState
                  ? this.state.tombPositioningState
                  : null
              }
            />
          </React.Fragment>
        ) : null}
      </Modal>
    );

    return (
      <div className={classes.Tracker}>
        {/* {this.props.mvpError ? (
          <div className={classes.Error}>{this.props.mvpError.response.data.error}</div>
        ) : null} */}
        <HeaderBar>
          {this.props.trackerName ? this.props.trackerName : "MvP Tracker"}
        </HeaderBar>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <link
              rel="stylesheet"
              href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
              integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
              crossOrigin="anonymous"
            />
            {mainContentToRender}
            {noMvpsPlaceholder}
            {newMvpForm}
            {mapToRender}
            {routeToDefault}
            {newMvpButton}
            {notiArrToRender}
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
    userId: state.auth.userId,
    token: state.auth.token,
    loading: state.mvp.loading,
    trackerName: state.mvp.activeTrackerName,
    trackerKey: state.mvp.activeTrackerKey,
    userKey: state.mvp.userKey || localStorage.getItem("userKey"),
    lastUpdated: state.mvp.lastUpdated,
    notiSettings: state.mvp.notificationSettings,
    mvpError: state.mvp.error,
    logs: state.mvp.logs,
    logsLoading: state.mvp.logsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMvpsFromDb: (
      token,
      userId,
      trackerName,
      isLoader,
      trackerKey,
      userKey
    ) =>
      dispatch(
        actions.fetchMvpsFromDb(
          token,
          userId,
          trackerName,
          isLoader,
          trackerKey,
          userKey
        )
      ),
    createNewTracker: (
      userId,
      token,
      trackerName,
      userKey,
      mvps,
      trackerKey,
      allTrackers
    ) =>
      dispatch(
        actions.createNewMvpTracker(
          userId,
          token,
          trackerName,
          userKey,
          mvps,
          trackerKey,
          allTrackers
        )
      ),
    saveMvpsToDbAndFetch: (
      userId,
      userKey,
      token,
      trackerKey,
      mvps,
      trackerName,
      logs,
      newLog
    ) =>
      dispatch(
        actions.saveMvpsToDbAndFetch(
          userId,
          userKey,
          token,
          trackerKey,
          mvps,
          trackerName,
          logs,
          newLog
        )
      ),
    saveSingleMvpToDb: (
      minuteAgo,
      mvpKey,
      userKey,
      token,
      trackerKey,
      mvp,
      eventType,
      note
    ) =>
      dispatch(
        actions.saveSingleMvpToDb(
          minuteAgo,
          mvpKey,
          userKey,
          token,
          trackerKey,
          mvp,
          eventType,
          note
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
      ),
    saveLogs: (userKey, token, trackerKey, logs, newLog) =>
      dispatch(actions.saveLogs(userKey, token, trackerKey, logs, newLog))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Tracker)
);
