import React, { Component } from "react";
import Tracker from "../../components/Tracker/Tracker";
import TrackerLogs from "../../components/Tracker/TrackerLogs/TrackerLogs";
import HeaderBar from "../../components/UI/HeaderBar/HeaderBar";
import { connect } from "react-redux";
import classes from './MvpTracker.css'

class MvPTracker extends Component {
  state = {
    showTrackerLogs: false,
    trackerLogsTouched: false
  };

  toggleTrackerLogsHandler = () => {
    this.setState({
      ...this.state,
      showTrackerLogs: !this.state.showTrackerLogs
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showTrackerLogs && !this.state.trackerLogsTouched) {
      this.setState({
        ...this.state,
        trackerLogsTouched: true
      });
    }
  }
  render() {
    let TrackerLogsClasses = [classes.TrackerLogs];
    if (this.state.showTrackerLogs && this.state.trackerLogsTouched) {
      TrackerLogsClasses.push(classes.Show);
    } else if (this.state.trackerLogsTouched) {
      TrackerLogsClasses.push(classes.Hide);
    }
    return (
      <div>
        {this.props.hasMvps ? (
          <div className={TrackerLogsClasses.join(' ')}>
            <TrackerLogs
              currentLogs={this.props.logs}
              logsLoading={this.props.logsLoading}
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
