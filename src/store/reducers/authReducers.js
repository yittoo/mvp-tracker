import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility/utility";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  premium: false,
  message: null
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.payload.idToken,
    userId: action.payload.userId,
    error: null,
    loading: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return updateObject(state, { error: null, loading: true });
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return updateObject(state, {
        error: action.payload.error,
        loading: false
      });
    case actionTypes.AUTH_LOGOUT:
      return updateObject(state, { token: null, userId: null });
    case actionTypes.SEND_PASSWORD_RESET_START:
      return updateObject(state, { loading: true });
    case actionTypes.SEND_PASSWORD_RESET_SUCCESS:
      return updateObject(state, {
        loading: false,
        message: action.payload.message
      });
    case actionTypes.SEND_PASSWORD_RESET_FAIL:
      return updateObject(state, {
        loading: false,
        error: action.payload.error
      });
    case actionTypes.CLEAR_AUTH_MESSAGE:
      return updateObject(state, { message: null });
    case actionTypes.DELETE_ACCOUNT_START:
      return updateObject(state, { loading: true });
    case actionTypes.DELETE_ACCOUNT_SUCCESS:
      return initialState;
    case actionTypes.DELETE_ACCOUNT_FAIL:
      return updateObject(state, {
        loading: false,
        error: action.payload.error
      });
    default:
      return state;
  }
};

// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     default:
//       return state;
//   }
// };

export default reducer;
