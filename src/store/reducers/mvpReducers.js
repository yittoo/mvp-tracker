import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility/utility";

const initialState = {
  mvps: null,
  loading: false,
  error: null,
  currentTime: new Date(),
  userKey: null,
  activeTrackerName: null,
  activeTrackerKey: null,
  allTrackers: null // TODO
};

const mvpKilled = (state, action) => {
  return {
    ...state,
    mvps: {
      ...state.mvps,
      [action.payload.mvpId]: {
        ...state.mvps[action.payload.mvpId],
        timeKilled: action.payload.timeKilled,
        maxTillSpawn: action.payload.maxTillSpawn,
        minTillSpawn: action.payload.minTillSpawn
      }
    }
  }
};

const calculateTimeTillSpawn = (state, action) => {
  return {
    ...state,
    mvps: {
      ...state.mvps,
      [action.payload.mvpId]: {
        ...state.mvps[action.payload.mvpId],
        minTillSpawn: action.payload.minTillSpawn,
        maxTillSpawn: action.payload.maxTillSpawn,
      }
    }
  }
};

const fetchMvpsSuccess = (state, action) => {
  return updateObject(state, {
    userKey: action.payload.userKey,
    activeTrackerKey: action.payload.trackerKey,
    activeTrackerName: action.payload.trackerName,
    mvps: action.payload.mvps,
    loading: false
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_MVPS_START:
      return updateObject(state, { loading: true });
    case actionTypes.FETCH_MVPS_SUCCESS:
      return fetchMvpsSuccess(state, action);
    case actionTypes.FETCH_MVPS_FAIL:
      return updateObject(state, { loading: false });
    case actionTypes.UPDATE_CURRENT_TIME:
      return updateObject(state, { currentTime: action.payload.currentTime });
    case actionTypes.MVP_KILLED:
      return mvpKilled(state, action);
    case actionTypes.CALCULATE_TIME_TILL_SPAWN:
      return calculateTimeTillSpawn(state, action);
    case actionTypes.CREATE_MVPS_START:
      return updateObject(state, { loading: true });
    case actionTypes.CREATE_MVPS_FAIL:
      return updateObject(state, { loading: true });
    case actionTypes.CREATE_MVPS_SUCCESS:
      return updateObject(state, { loading: false });
    // case actionTypes.SET_TRACKER_NAMES:
    //   return updateObject(state, {allTrackers: action.payload.allTrackers});
    default:
      return initialState;
  }
};

export default reducer;
