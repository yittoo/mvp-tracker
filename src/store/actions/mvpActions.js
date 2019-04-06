import * as actionTypes from "./actionTypes";
import mainAxios from "../../axios-mvps";

export const fetchMvpsSuccess = (mvps, userKey, trackerKey, trackerName) => {
  return {
    type: actionTypes.FETCH_MVPS_SUCCESS,
    payload: {
      mvps: mvps,
      userKey: userKey,
      trackerKey: trackerKey,
      trackerName: trackerName
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

export const createMvpsSuccess = () => {
  return {
    type: actionTypes.CREATE_MVPS_SUCCESS,
  };
};

export const createMvpsFailed = error => {
  return {
    type: actionTypes.CREATE_MVPS_FAIL,
    payload: {
      error: error
    }
  };
};

export const createMvpsStart = () => {
  return {
    type: actionTypes.CREATE_MVPS_START
  };
};

export const createNewMvpTracker = (
  userId,
  token,
  trackerName,
  userKey,
  mvps
) => {
  return dispatch => {
    dispatch(createMvpsStart());
    const objToCast = { mvps: mvps, trackerName: trackerName };
    const queryParams = "?auth=" + token;
    mainAxios
      .post("/users/" + userKey + "/trackers.json" + queryParams, objToCast)
      .then(res => {
        dispatch(createMvpsSuccess()).then(
          dispatch(fetchMvpsFromDb(token, userId, trackerName))
        );
      })
      .catch(error => {
        dispatch(createMvpsFailed(error));
      });
  };
};

export const saveMvpsToDb = (userId, userKey, token, trackerKey, mvps, trackerName) => {
  return dispatch => {
    dispatch(saveMvpsStart());
    const url = "/users/" + userKey + "/trackers/" + trackerKey + ".json";
    const queryParams = "?auth=" + token;
    mainAxios.put(url + queryParams, { mvps: mvps, trackerName: trackerName }).then(res => {
      console.log(res.data);
      dispatch(saveMvpsSuccess()).then(
        dispatch(fetchMvpsFromDb(token, userId, trackerName))
      )
    }).catch(err => {
      dispatch(saveMvpsFail(err));
    })
  };
};

export const saveMvpsSuccess = () => {
  return {
    type: actionTypes.SAVE_MVPS_SUCCESS
  };
};

export const saveMvpsFail = () => {
  return {
    type: actionTypes.SAVE_MVPS_FAIL
  };
};

export const saveMvpsStart = () => {
  return {
    type: actionTypes.SAVE_MVPS_START
  };
};

export const fetchMvpsFromDb = (token, userId, trackerName) => {
  return dispatch => {
    dispatch(fetchMvpsStart());
    const queryParams =
      "?auth=" + token + '&orderBy="userId"&equalTo="' + userId + '"';
    mainAxios
      .get("users.json" + queryParams)
      .then(res => {
        Object.keys(res.data).map(userKey => {
          // keys to keep: userKey + trackerKey
          // put link => https://mvp-ro.firebaseio.com/users/%USER_KEY%/trackers/%TRACKER_KEY%
          // object to put mvps object
          const trackerObj = res.data[userKey].trackers;
          // let allTrackers = {};
          if (!trackerObj) {
            return dispatch(fetchMvpsSuccess(null, userKey, null, null));
          } else {
            Object.keys(trackerObj).map(trackerKey => {
              // allTrackers[trackerKey] = trackerObj[trackerKey];
              if (
                !trackerName ||
                trackerName === trackerObj[trackerKey].trackerName
              ) {
                trackerName = trackerObj[trackerKey].trackerName;
                localStorage.setItem("activeTrackerName", trackerName);
                localStorage.setItem("activeTrackerKey", trackerKey);
                return dispatch(
                  fetchMvpsSuccess(
                    trackerObj[trackerKey].mvps,
                    userKey,
                    trackerKey,
                    trackerName
                  )
                );
              }
            });
          }
          // setTrackerNames(allTrackers);
        });
      })
      .catch(error => {
        return dispatch(fetchMvpsFailed(error));
      });
  };
};

// export const setTrackerNames = (trackers) => {
//   return {
//     type: actionTypes.SET_TRACKER_NAMES,
//     payload: {
//       allTrackers: trackers
//     }
//   }
// }

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
  const fixedKilledAt = killedAt ? new Date(JSON.parse(JSON.stringify(killedAt))) : null;
  const differenceInMinutes = ((currentTime - fixedKilledAt) / 60000).toFixed(0);
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
//     if (!mvps) {
//       dispatch(fetchMvpsFailed("No mvps in local storage"));
//     } else {
//       const mvpsToParse = JSON.parse(localStorage.getItem("mvps"));
//       const dateFixedMvps = mvpsToParse
//         ? Object.keys(mvpsToParse).map(mvp => {
//             let objToCast = { ...mvpsToParse[mvp] };
//             objToCast.timeKilled = objToCast.timeKilled
//               ? new Date(JSON.parse(JSON.stringify(objToCast.timeKilled)))
//               : null;
//             return objToCast;
//           })
//         : null;
//       dispatch(fetchMvpsSuccess(dateFixedMvps));
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
