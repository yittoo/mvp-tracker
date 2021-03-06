import React, { Component } from "react";
import Button from "../../UI/Button/Button";
import classes from "./MvpEntry.css";
import colors from "../../UI/Colors/Colors.css";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";

class MvpEntry extends Component {
  state = {
    minAgoValue: 0,
    deleteMode: localStorage.getItem("mvpDeleteMode") === "true",
    hasNotificated: false,
    showNote: false,
    noteContentToSave: null,
    noteEditMode: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.mvp !== this.props.mvp ||
      nextState.minAgoValue !== this.state.minAgoValue ||
      nextState.showNote !== this.state.showNote ||
      nextState.noteContentToSave !== this.state.noteContentToSave ||
      nextState.noteEditMode !== this.state.noteEditMode
    ) {
      return true;
    } else {
      return false;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.mvp.maxTillSpawn !== this.props.mvp.maxTillSpawn ||
      prevProps.mvp.minTillSpawn !== this.props.mvp.minTillSpawn
    ) {
      this.onShouldNotificate();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  inputChangedHandler = (event, addressToUpdate) => {
    if (addressToUpdate === "minAgoValue") {
      const value =
        event.target.value < 0 || isNaN(event.target.value)
          ? 0
          : event.target.value;
      this.setState({
        ...this.state,
        minAgoValue: Number(value)
      });
    } else {
      this.setState({
        ...this.state,
        [addressToUpdate]: event.target.value
      });
    }
  };

  onMvpKilledBtn = (minAgo, mvpKey) => {
    const mvpToCast = {
      ...this.props.mvp,
      killedBy: localStorage.getItem("nickname").substring(0,36)
    };
    this.props.onSaveLogs("L", mvpToCast.name)
    this.props.saveSingleMvpToDb(
      minAgo,
      mvpKey,
      this.props.userKey,
      this.props.token,
      this.props.trackerKey,
      mvpToCast,
      "killed",
      null
    );
    this.setState({
      ...this.state,
      minAgoValue: 0,
      showNote: false,
      noteEditMode: false
    });
  };

  onMvpUndoBtn = () => {
    this.props.onSaveLogs("U", this.props.mvp.name)
    this.props.undoMvpChange(
      this.props.id,
      this.props.userKey,
      this.props.token,
      this.props.mvp,
      this.props.trackerKey
    );
  };

  onMvpDeletedBtn = mvpKey => {
    this.props.onSaveLogs("D", this.props.mvp.name)
    this.props.saveSingleMvpToDb(
      null,
      mvpKey,
      this.props.userKey,
      this.props.token,
      this.props.trackerKey,
      null,
      "delete",
      null
    );
    this.setState({
      ...this.state,
      minAgoValue: 0,
      showNote: false,
      noteEditMode: false
    });
  };

  onMvpNotiToggleBtn = mvpKey => {
    const mvpToCast = {
      ...this.props.mvp,
      notification: !this.props.mvp.notification
    };
    this.props.saveSingleMvpToDb(
      null,
      mvpKey,
      this.props.userKey,
      this.props.token,
      this.props.trackerKey,
      mvpToCast,
      "toggleNotification",
      this.props.mvp.note
    );
    this.setState({
      ...this.state,
      minAgoValue: 0
    });
  };

  onShouldNotificate = () => {
    if (
      this.props.notiMode === "all" ||
      (this.props.notiMode === "custom" && this.props.mvp.notification)
    ) {
      let notificationToSend;
      notificationToSend =
        this.props.mvp.minTillSpawn === 10
          ? { mvpKey: this.props.id, type: "tenTillMin" }
          : null;
      notificationToSend =
        this.props.mvp.minTillSpawn === 0
          ? { mvpKey: this.props.id, type: "onMin" }
          : notificationToSend;
      notificationToSend =
        this.props.mvp.maxTillSpawn === 0
          ? { mvpKey: this.props.id, type: "onMax" }
          : notificationToSend;
      if (notificationToSend && !this.state.hasNotificated) {
        this.setState({
          ...this.state,
          hasNotificated: true
        });
        this.props.onNotificate(notificationToSend);
        setTimeout(() => {
          this.setState({
            ...this.state,
            hasNotificated: false
          });
        }, 60000);
      }
    }
  };

  toggleShowNoteHandler = () => {
    this.setState({
      ...this.state,
      showNote: !this.state.showNote,
      noteEditMode: false
    });
  };

  onSaveNoteBtn = () => {
    this.props.saveSingleMvpToDb(
      null,
      this.props.id,
      this.props.userKey,
      this.props.token,
      this.props.trackerKey,
      this.props.mvp,
      "saveNote",
      this.state.noteContentToSave
    );
    this.props.onSaveLogs("N", this.props.mvp.name);
    this.setState({
      ...this.state,
      showNote: false,
      noteEditMode: false
    });
  };

  switchEditNoteModeToggler = () => {
    this.setState({
      ...this.state,
      noteEditMode: !this.state.noteEditMode,
      noteContentToSave: this.props.mvp.note
    });
  };

  render() {
    const nameClasses = [classes.Name, colors.Blue];

    let untilSpawnColor =
      Number(this.props.mvp.minTillSpawn) > 10 ? "Purple" : "Green";
    untilSpawnColor =
      Number(this.props.mvp.maxTillSpawn) <= 0 ? "Red" : untilSpawnColor;
    untilSpawnColor =
      this.props.mvp.maxTillSpawn === "Unknown" ||
      this.props.mvp.maxTillSpawn === undefined ||
      this.props.mvp.maxTillSpawn === null
        ? "LightGray"
        : untilSpawnColor;

    const agoOrMore = untilSpawnColor === "Red" ? "ago" : "more";
    const untilSpawnClasses = [classes.UntilSpawn, colors[untilSpawnColor]];

    let untilSpawnValue =
      this.props.mvp.minTillSpawn === "Unknown" ||
      this.props.mvp.minTillSpawn === undefined ||
      this.props.mvp.minTillSpawn === null
        ? "Unknown"
        : this.props.mvp.minTillSpawn + " - " + this.props.mvp.maxTillSpawn;

    if (Number(this.props.mvp.maxTillSpawn < 0)) {
      untilSpawnValue =
        Math.abs(this.props.mvp.minTillSpawn) +
        " - " +
        Math.abs(this.props.mvp.maxTillSpawn);
    }

    const untilSpawnAfter =
      untilSpawnValue === "Unknown" ? null : (
        <span>
          <br />
          minutes {agoOrMore}
        </span>
      );

    const minuteInput = (
      <input
        className={classes.HideOnSmall}
        type="text"
        value={this.state.minAgoValue}
        min="0"
        placeholder="Killed ... minutes ago"
        onChange={event => this.inputChangedHandler(event, "minAgoValue")}
      />
    );

    const mvpDeleteBtn = this.state.deleteMode ? (
      <Button clicked={() => this.onMvpDeletedBtn(this.props.id)}>
        Delete
      </Button>
    ) : null;

    const mvpNotiToggleBtn =
      this.props.notiMode === "custom" ? (
        <Button clicked={() => this.onMvpNotiToggleBtn(this.props.id)}>
          {this.props.mvp.notification ? "Set Alert Off" : "Set Alert On"}
        </Button>
      ) : null;

    const killMvpDiv = (
      <div className={classes.Killed}>
        <span>Killed</span>
        {minuteInput}
        <span className={classes.MarginRight5px}>minutes ago</span>
        <Button
          classes="HideOnSmall"
          clicked={() =>
            this.onMvpKilledBtn(this.state.minAgoValue, this.props.id)
          }
        >
          Submit
        </Button>
        <Button
          classes="HideOnLarge"
          clicked={() => {
            this.onMvpKilledBtn(0, this.props.id);
          }}
        >
          Killed Now
        </Button>
        <Button clicked={this.onMvpUndoBtn}>Undo</Button>
        {mvpDeleteBtn}
        {mvpNotiToggleBtn}
      </div>
    );

    const notesContent = this.state.noteEditMode ? (
      <textarea
        onChange={event => this.inputChangedHandler(event, "noteContentToSave")}
        value={this.state.noteContentToSave}
        className={classes.NoteChild}
        placeholder="Max 250 chars"
      />
    ) : (
      <p className={classes.NoteChild}>
        {this.props.mvp.note ? this.props.mvp.note : "No note to display."}
      </p>
    );

    const killedByDiv = (
      <div
        className={
          this.state.showNote
            ? classes.KilledBy + " " + classes.Display
            : classes.KilledBy
        }
      >
        <h3 className={colors.Gray}>
          Killed by:{" "}
          <span
            className={
              this.props.mvp.killedBy && this.props.mvp.killedBy !== "Unknown"
                ? colors.Green
                : colors.LightGray
            }
          >
            {this.props.mvp.killedBy ? this.props.mvp.killedBy : "Unknown"}
          </span>
        </h3>
      </div>
    );

    const notesDiv = (
      <div
        className={
          this.state.showNote
            ? classes.Note + " " + classes.Display
            : classes.Note
        }
      >
        {notesContent}
        <br />
        <Button clicked={this.switchEditNoteModeToggler}>
          {this.state.noteEditMode ? "Cancel" : "Edit"}
        </Button>
        <Button
          clicked={this.onSaveNoteBtn}
          disabled={!this.state.noteEditMode}
        >
          Save
        </Button>
      </div>
    );

    return (
      <div
        className={
          this.props.mvpViewMode === "wide"
            ? classes.MvpEntry
            : classes.MvpEntryCompact
        }
      >
        <div className={nameClasses.join(" ")}>
          {this.props.mvp.name}
          {this.props.mvp.note ? (
            <i
              className="fas fa-comment"
              onClick={this.toggleShowNoteHandler}
            />
          ) : (
            <i
              className="far fa-comment"
              onClick={this.toggleShowNoteHandler}
            />
          )}{" "}
          {this.props.mvp.tombRatioX ? (
            <i
              className="fas fa-cross"
              onClick={() =>
                this.props.onMapOpen(
                  this.props.mvp,
                  this.props.id,
                  this.props.mvp.map
                )
              }
            />
          ) : null}
        </div>
        <div className={classes.FixedTimer}>
          {this.props.mvp.minSpawn} - {this.props.mvp.maxSpawn} minutes
        </div>
        <div
          className={classes.Map}
          onClick={() =>
            this.props.onMapOpen(
              this.props.mvp,
              this.props.id,
              this.props.mvp.map
            )
          }
        >
          {this.props.mvp.map}
        </div>
        <div className={untilSpawnClasses.join(" ")}>
          {untilSpawnValue}
          {untilSpawnAfter}
        </div>
        {killMvpDiv}
        {killedByDiv}
        {notesDiv}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentTime: state.mvp.currentTime,
    userKey: state.mvp.userKey,
    token: state.auth.token,
    trackerKey: state.mvp.activeTrackerKey,
    notiMode: state.mvp.notificationSettings.notiMode.mode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    calculateTimeTillSpawn: (
      killedAt,
      minSpawn,
      maxSpawn,
      currentTime,
      mvpId
    ) =>
      dispatch(
        actions.calculateTimeToSpawn(
          killedAt,
          minSpawn,
          maxSpawn,
          currentTime,
          mvpId
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
    ) => {
      return dispatch(
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
      );
    },
    undoMvpChange: (mvpKey, userKey, token, mvp, trackerKey) => {
      return dispatch(
        actions.undoMvpChange(mvpKey, userKey, token, mvp, trackerKey)
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MvpEntry);
