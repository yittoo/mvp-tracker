import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility/utility";
import { NONAME } from "dns";

const initialState = {
  mvps: null,
  loading: false,
  error: null,
  currentTime: new Date(),
  userKey: null,
  activeTrackerName: null,
  activeTrackerKey: null,
  allTrackers: null,
  lastUpdated: new Date(),
  message: null,
  notificationSettings: {
    notiSound: { mode: false },
    notiMode: { mode: "none" },
    notiType: {
      onMax: false,
      onMin: false,
      tenTillMin: false
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
        maxTillSpawn: action.payload.maxTillSpawn
      }
    }
  };
};

const fetchMvpsSuccess = (state, action) => {
  return updateObject(state, {
    userKey: action.payload.userKey,
    activeTrackerKey: action.payload.trackerKey,
    activeTrackerName: action.payload.trackerName,
    mvps: action.payload.mvps,
    loading: false,
    lastUpdated: action.payload.lastUpdated
  });
};

const saveMvpsSuccess = (state, action) => {
  return updateObject(state, {
    loading: false
  });
};

const saveSingleMvpSuccess = (state, action) => {
  return {
    ...state,
    loading: false,
    lastUpdated: new Date(),
    mvps: {
      ...state.mvps,
      [action.payload.mvpId]: {
        ...state.mvps[action.payload.mvpId],
        timeKilled: action.payload.timeKilled,
        maxTillSpawn: action.payload.maxTillSpawn,
        minTillSpawn: action.payload.minTillSpawn
      }
    }
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_MVPS_START:
      return updateObject(state, { loading: true });
    case actionTypes.FETCH_MVPS_SUCCESS:
      return fetchMvpsSuccess(state, action);
    case actionTypes.FETCH_MVPS_FAIL:
      return updateObject(state, {
        loading: false,
        error: action.payload.error
      });
    case actionTypes.CREATE_MVPS_START:
      return updateObject(state, { loading: true, mvps: action.payload.mvps });
    case actionTypes.CREATE_MVPS_SUCCESS:
      return saveMvpsSuccess(state, action);
    case actionTypes.CREATE_MVPS_FAIL:
      return updateObject(state, {
        error: action.payload.error,
        loading: false
      });
    case actionTypes.SAVE_MVPS_START:
      return updateObject(state, { loading: true });
    case actionTypes.SAVE_MVPS_SUCCESS:
      return updateObject(state, { loading: false });
    case actionTypes.SAVE_MVPS_FAIL:
      return updateObject(state, {
        error: action.payload.error,
        loading: false
      });
    case actionTypes.SAVE_SINGLE_MVP_START:
      return updateObject(state, {});
    case actionTypes.SAVE_SINGLE_MVP_SUCCESS:
      return saveSingleMvpSuccess(state, action);
    case actionTypes.SAVE_SINGLE_MVP_FAIL:
      return updateObject(state, { error: action.payload.error });
    case actionTypes.DELETE_TRACKER_START:
      return updateObject(state, { loading: true });
    case actionTypes.DELETE_TRACKER_SUCCESS:
      return updateObject(state, {
        loading: false,
        message: action.payload.message
      });
    case actionTypes.DELETE_TRACKER_FAIL:
      return updateObject(state, { loading: false });
    case actionTypes.UPDATE_CURRENT_TIME:
      return updateObject(state, { currentTime: action.payload.currentTime });
    case actionTypes.CALCULATE_TIME_TILL_SPAWN:
      return calculateTimeTillSpawn(state, action);
    case actionTypes.CALCULATE_TIME_ALL_MVPS:
      return updateObject(state, { mvps: action.payload.mvps });
    case actionTypes.STORE_ALL_TRACKERS:
      return updateObject(state, { allTrackers: action.payload.trackers });
    case actionTypes.CLEAR_MVP_MESSAGE:
      return updateObject(state, { message: null });
    case actionTypes.FETCH_USER_KEY_START:
      return updateObject(state, { loading: true });
    case actionTypes.FETCH_USER_KEY_SUCCESS:
      return updateObject(state, {
        loading: false,
        userKey: action.payload.userKey
      });
    case actionTypes.SAVE_NOTIFICATIONS_START:
      return updateObject(state, {
        loading: true
      });
    case actionTypes.SAVE_NOTIFICATIONS_SUCCESS:
      return updateObject(state, {
        loading: false,
        notificationSettings: {
          ...state.notificationSettings,
          [action.payload.notiTypeKey]: action.payload.itemToCast
        }
      });
    case actionTypes.SAVE_NOTIFICATIONS_FAIL:
      return updateObject(state, {
        loading: false,
        error: action.payload.error
      });
    case actionTypes.INITIALIZE_NOTIFICATIONS_START:
      return updateObject(state, { loading: true });
    case actionTypes.INITIALIZE_NOTIFICATIONS_SUCCESS:
      return updateObject(state, {
        loading: false,
        notificationSettings: action.payload.notificationSettings
      });
    case actionTypes.INITIALIZE_NOTIFICATIONS_FAIL:
      return updateObject(state, {
        loading: false,
        error: action.payload.error
      });
    default:
      return initialState;
  }
};

export default reducer;
