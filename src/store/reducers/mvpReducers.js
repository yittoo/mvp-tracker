import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility/utility";

const initialState = {
  mvps: [
    {
      id: 1150,
      name: "Moonlight Flower",
      map: "pay_dun04",
      minSpawn: 60,
      maxSpawn: 70,
      color: "Purple",
      minTillSpawn: null,
      maxTillSpawn: null,
      minAgoValue: 0,
      timeKilled: null
    },
    {
      id: 1252,
      name: "Garm",
      map: "xmas_fild01",
      minSpawn: 120,
      maxSpawn: 130,
      color: "Purple",
      minTillSpawn: null,
      maxTillSpawn: null,
      minAgoValue: 0,
      timeKilled: null
    }
  ],
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_MVP_START:
      return updateObject(state, { mvps: action.mvps, loading: true });
    case actionTypes.FETCH_MVP_SUCCESS:
      return updateObject(state, { mvps: action.mvps, loading: false });
    case actionTypes.FETCH_MVP_FAIL:
      return updateObject(state, { mvps: action.mvps, loading: false });
    default:
      return initialState;
  }
};

export default reducer;
