import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility/utility";

const initialState = {
  something: "somethingElse"
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return initialState;
  }
};

export default reducer;
