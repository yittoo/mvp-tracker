import * as actionTypes from "./actionTypes";
import { resolve } from "upath";

export const fetchMvpsSuccess = mvps => {
  return {
    type: actionTypes.FETCH_MVPS_SUCCESS,
    payload: {
      mvps: mvps
    }
  };
};

export const fetchMvpsFailed = error => {
  return {
    type: actionTypes.FETCH_MVPS_FAIL,
    payload: {
      error: error
    }
  };
};

export const fetchMvpsStart = () => {
  return {
    type: actionTypes.FETCH_MVPS_START
  };
};

// export const fetchMvpsFromDb = (mvps, token) => {
//   return dispatch => {
//     dispatch(fetchMvpsStart());
//     axios
//       .get("/mvps.json?auth=" + token)
//       .then(response => {
//         dispatch(fetchMvpsSuccess(response.data.mvps));
//       })
//       .catch(error => {
//         dispatch(fetchMvpsFailed(error));
//       });
//   };
// };

export const fetchMvpsFromLocal = () => {
  return dispatch => {
    dispatch(fetchMvpsStart());
    const mvps = localStorage.getItem("mvps");
    if (!mvps) {
      dispatch(fetchMvpsFailed("No mvps in local storage"));
    } else {
      dispatch(fetchMvpsSuccess(mvps));
    }
  };
};

export const saveMvpsLocal = mvps => {
  return localStorage.setItem("mvps", mvps);
};

export const updateCurrentTime = () => {
  return {
    type: actionTypes.UPDATE_CURRENT_TIME,
    payload: {
      currentTime: new Date()
    }
  };
};

export const calculateTimeToSpawn = (
  killedAt,
  minSpawn,
  maxSpawn,
  currentTime,
  mvpId
) => {
  const differenceInMinutes = ((currentTime - killedAt) / 60000).toFixed(0);
  const minTillSpawn =
    differenceInMinutes > 1440 ? "Unknown" : minSpawn - differenceInMinutes;
  const maxTillSpawn =
    differenceInMinutes > 1440 ? "Unknown" : maxSpawn - differenceInMinutes;
  return {
    type: actionTypes.CALCULATE_TIME_TILL_SPAWN,
    payload: {
      mvpId: mvpId,
      minTillSpawn: minTillSpawn,
      maxTillSpawn: maxTillSpawn
    }
  };
};

export const mvpKilled = (minuteAgo, mvpId, minSpawn, maxSpawn) => {
  return {
    type: actionTypes.MVP_KILLED,
    payload: {
      mvpId: mvpId,
      timeKilled: new Date(new Date().getTime() - Number(minuteAgo) * 60000),
      minTillSpawn: minSpawn,
      maxTillSpawn: maxSpawn
    }
  };
};

// export const fetchMvpsFromLocal = () => {
//   return dispatch => {
//     dispatch(fetchMvpsStart());
//     const mvps = localStorage.getItem("mvps");
//     if(!mvps){
//       dispatch(fetchMvpsFailed("No mvps in local storage"))
//     } else {
//       dispatch(fetchMvpsSuccess(mvps));
//     }
//   };
// };

// export const auth = (email, password, isSignup) => {
//   return dispatch => {
//     dispatch(authStart());
//     const authData = {
//       email: email,
//       password: password,
//       returnSecureToken: true
//     };
//     let url =
//       "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBtRfSHQ3rXlV_tHJyyBdzBaEALHeS8Xdg";
//     if (!isSignup) {
//       url =
//         "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBtRfSHQ3rXlV_tHJyyBdzBaEALHeS8Xdg";
//     }
//     axios
//       .post(url, authData)
//       .then(response => {
//         const expirationDate = new Date(
//           new Date().getTime() + response.data.expiresIn * 1000
//         );
//         localStorage.setItem("token", response.data.idToken);
//         localStorage.setItem("userId", response.data.localId);
//         localStorage.setItem("expirationDate", expirationDate);
//         dispatch(authSuccess(response.data.idToken, response.data.localId));
//         dispatch(checkAuthTimeout(response.data.expiresIn));
//       })
//       .catch(err => {
//         dispatch(authFail(err.response.data.error));
//       });
//   };
// };
