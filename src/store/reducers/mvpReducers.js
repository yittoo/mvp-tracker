import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility/utility";

const initialState = {
  mvps: {
    dsajhgfdsjh8as: {
      id: 1150,
      name: "Moonlight Flower",
      map: "pay_dun04",
      minSpawn: 60,
      maxSpawn: 70,
      minTillSpawn: null,
      maxTillSpawn: null,
      timeKilled: null
    },
    dsajhdsafdsjh8as: {
      id: 1252,
      name: "Garm",
      map: "xmas_fild01",
      minSpawn: 120,
      maxSpawn: 130,
      minTillSpawn: null,
      maxTillSpawn: null,
      timeKilled: null
    }
  },
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
      return updateObject(state, { mvps: action.payload.mvps, loading: true });
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
