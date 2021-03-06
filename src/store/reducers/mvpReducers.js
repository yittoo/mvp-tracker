import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility/utility";

const initialState = {
  mvps: null,
  logs: {},
  loading: false,
  logsLoading: false,
  error: null,
  currentTime: new Date(),
  userKey: null,
  activeTrackerName: null,
  activeTrackerKey: null,
  allTrackers: null,
  lastUpdated: new Date(),
  message: null,
  notificationSettings: {
    notiSound: { mode: false, volume: 0.5 },
    notiMode: { mode: "none" },
    notiType: {
      onMax: false,
      onMin: false,
      tenTillMin: false
    }
  },
  theme: null
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
    lastUpdated: action.payload.lastUpdated,
    logs: action.payload.logs
  });
};

const saveMvpsSuccess = (state, action) => {
  return updateObject(state, {
    loading: false
  });
};

const saveSingleMvpSuccess = (state, action) => {
  let mvpsCopy = { ...state.mvps };
  if (!action.payload.mvp) {
    delete mvpsCopy[action.payload.mvpId];
  } else {
    mvpsCopy[action.payload.mvpId] = action.payload.mvp;
  }
  return {
    ...state,
    loading: false,
    mvps: {
      ...mvpsCopy
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
        loading: false
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
    case actionTypes.CHANGE_DEFAULT_TRACKER:
      return updateObject(state, {
        activeTrackerKey: action.payload.trackerKey,
        activeTrackerName: action.payload.trackerName
      });
    case actionTypes.DELETE_TRACKER_FAIL:
      return updateObject(state, { loading: false });
    case actionTypes.UPDATE_CURRENT_TIME:
      return updateObject(state, { currentTime: action.payload.currentTime });
    case actionTypes.CALCULATE_TIME_TILL_SPAWN:
      return calculateTimeTillSpawn(state, action);
    case actionTypes.CALCULATE_TIME_ALL_MVPS:
      return updateObject(state, { mvps: action.payload.mvps });
    case actionTypes.CLEAR_MVP_MESSAGE:
      return updateObject(state, { message: null });
    case actionTypes.FETCH_USER_KEY_START:
      return updateObject(state, { loading: true });
    case actionTypes.FETCH_USER_KEY_SUCCESS:
      return updateObject(state, {
        loading: false,
        userKey: action.payload.userKey
      });
    case actionTypes.FETCH_USER_KEY_FAIL:
      return updateObject(state, {
        loading: false
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
    case actionTypes.INITIALIZE_SETTINGS_START:
      return state;
    case actionTypes.INITIALIZE_SETTINGS_SUCCESS:
      return updateObject(state, {
        notificationSettings: action.payload.notificationSettings,
        theme: action.payload.theme,
        userKey: action.payload.userKey
      });
    case actionTypes.INITIALIZE_SETTINGS_FAIL:
      return updateObject(state, {
        error: action.payload.error
      });
    case actionTypes.SAVE_THEME_START:
      return updateObject(state, { loading: true });
    case actionTypes.SAVE_THEME_SUCCESS:
      return updateObject(state, {
        theme: action.payload.theme,
        loading: false
      });
    case actionTypes.SAVE_THEME_FAIL:
      return updateObject(state, {
        error: action.payload.error
      });
    case actionTypes.DELETE_ACCOUNT_START:
      return updateObject(state, { loading: true });
    case actionTypes.DELETE_ACCOUNT_SUCCESS:
      return initialState;
    case actionTypes.DELETE_ACCOUNT_FAIL:
      return updateObject(state, {
        loading: false,
        error: action.payload.error
      });
    case actionTypes.SAVE_LOGS_START:
      return state;
    case actionTypes.SAVE_LOGS_SUCCESS:
      return updateObject(state, { logs: action.payload.logs });
    case actionTypes.SAVE_LOGS_FAIL:
      return updateObject(state, { error: action.payload.error });
    case actionTypes.FETCH_ALL_TRACKERS_START:
      return updateObject(state, { loading: true });
    case actionTypes.FETCH_ALL_TRACKERS_SUCCESS:
      return updateObject(state, {
        loading: false,
        allTrackers: action.payload.trackers
      });
    case actionTypes.FETCH_ALL_TRACKERS_FAIL:
      return updateObject(state, {
        loading: false,
        error: action.payload.error
      });
    case actionTypes.AUTH_LOGOUT:
      return updateObject(state, {
        userKey: null,
        activeTrackerKey: null,
        activeTrackerName: null,
        mvps: null
      });
    default:
      return state;
  }
};

export default reducer;
