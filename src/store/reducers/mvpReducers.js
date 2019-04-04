import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility/utility";

const initialState = {
  mvps: null,
  loading: false,
  error: null,
  currentTime: new Date()
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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_MVPS_START:
      return updateObject(state, { loading: true });
    case actionTypes.FETCH_MVPS_SUCCESS:
      return updateObject(state, { mvps: action.payload.mvps, loading: false });
    case actionTypes.FETCH_MVPS_FAIL:
      return updateObject(state, { mvps: action.payload.mvps, loading: false });
    case actionTypes.UPDATE_CURRENT_TIME:
      return updateObject(state, { currentTime: action.payload.currentTime });
    case actionTypes.MVP_KILLED:
      return mvpKilled(state, action);
    case actionTypes.CALCULATE_TIME_TILL_SPAWN:
      return calculateTimeTillSpawn(state, action);
    default:
      return initialState;
  }
};

export default reducer;
