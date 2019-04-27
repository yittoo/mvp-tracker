import React, { Component } from "react";
import Tracker from "../../components/Tracker/Tracker";
import TrackerLogs from "../../components/Tracker/TrackerLogs/TrackerLogs";
import { connect } from "react-redux";

class MvPTracker extends Component {
  state = {};
  render() {
    return (
      <div>
        {this.props.hasMvps ? (
          <TrackerLogs
            currentLogs={this.props.logs}
            logsLoading={this.props.logsLoading}
          />
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
    hasMvps: state.mvp.mvps !== null
  };
};

export default connect(mapStateToProps)(MvPTracker);
