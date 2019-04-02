import * as actionTypes from "./actionTypes";

export const fetchMvpsSuccess = (mvps) => {
  return {
    type: actionTypes.FETCH_MVPS_SUCCESS,
    mvps: mvps
  };
};

export const fetchMvpsFailed = error => {
  return {
    type: actionTypes.FETCH_MVPS_FAIL,
    error: error
  };
};

export const fetchMvpsStart = () => {
  return {
    type: actionTypes.FETCH_MVPS_START
  };
};

export const fetchMvpsFromDb = (mvps, token) => {
  return dispatch => {
    dispatch(fetchMvpsStart());
    axios
      .get("/mvps.json?auth=" + token)
      .then(response => {
        dispatch(fetchMvpsSuccess(response.data.mvps));
      })
      .catch(error => {
        dispatch(fetchMvpsFailed(error));
      });
  };
};

export const fetchMvpsFromLocal = () => {
  return dispatch => {
    const mvps = localStorage.getItem("mvps");

    const expirationDate = new Date(localStorage.getItem("expirationDate"));
    if (expirationDate <= new Date()) {
      dispatch(logout());
    } else {
      const userId = localStorage.getItem("userId");
      dispatch(authSuccess(token, userId));
    }
  };
};
