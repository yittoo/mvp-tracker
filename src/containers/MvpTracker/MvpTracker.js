import React, { Component } from "react";
import Tracker from "../../components/Tracker/Tracker";
import TrackerLogs from "../../components/Tracker/TrackerLogs/TrackerLogs";
import HeaderBar from "../../components/UI/HeaderBar/HeaderBar";
import { connect } from "react-redux";
import classes from './MvpTracker.css'

class MvPTracker extends Component {
  state = {
    showTrackerLogs: false
  };

  toggleTrackerLogsHandler = () => {
    this.setState({
      ...this.state,
      showTrackerLogs: !this.state.showTrackerLogs
    });
  };
  render() {
    return (
      <div>
        {this.props.hasMvps ? (
          <div className={classes.TrackerLogs}>
            <TrackerLogs
              currentLogs={this.props.logs}
              logsLoading={this.props.logsLoading}
              show={this.state.showTrackerLogs}
            />
            <HeaderBar
              clicked={this.toggleTrackerLogsHandler}
              flippedAndCentered
              marginBottom
            >
              Tracker Logs
            </HeaderBar>
          </div>
        ) : null}
        <Tracker />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    logs: state.mvp.logs,
    logsLoading: state.mvp.logsLoading,
    hasMvps: state.mvp.mvps
  };
};

export default connect(mapStateToProps)(MvPTracker);
