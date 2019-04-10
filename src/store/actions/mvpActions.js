import * as actionTypes from "./actionTypes";
import mainAxios from "../../axios-mvps";

//-----FETCH
export const fetchMvpsFromDb = (
  token,
  userId,
  trackerName,
  isLoader,
  inputTrackerKey
) => {
  return dispatch => {
    if (isLoader) {
      dispatch(fetchMvpsStart());
    }
    const queryParams =
      "?auth=" + token + '&orderBy="userId"&equalTo="' + userId + '"';
    mainAxios
      .get("users.json" + queryParams)
      .then(res => {
        Object.keys(res.data).map(userKey => {
          const trackerObj = res.data[userKey].trackers;
          let trackersLength = Object.keys(trackerObj).length;
          if (!trackerObj) {
            return dispatch(fetchMvpsSuccess(null, userKey, null, null));
          } else {
            const allTrackerIdentifiers = [];
            Object.keys(trackerObj).map((trackerKey, index) => {
              allTrackerIdentifiers.push({
                trackerName: trackerObj[trackerKey].trackerName,
                trackerKey: trackerKey
              });
              if (
                !inputTrackerKey ||
                inputTrackerKey === trackerKey ||
                trackersLength === index + 1
              ) {
                trackersLength = null;
                const liveTrackerName = trackerObj[trackerKey].trackerName;
                localStorage.setItem("activeTrackerName", liveTrackerName);
                localStorage.setItem("activeTrackerKey", trackerKey);
                localStorage.setItem("userKey", userKey);
                dispatch(
                  fetchMvpsSuccess(
                    trackerObj[trackerKey].mvps,
                    userKey,
                    trackerKey,
                    liveTrackerName
                  )
                );
                dispatch(
                  calculateTimeToSpawnAllMvps(
                    new Date(),
                    trackerObj[trackerKey].mvps
                  )
                );
              }
            });
            dispatch(storeAllTrackers(allTrackerIdentifiers));
          }
        });
      })
      .catch(error => {
        return dispatch(fetchMvpsFailed(error));
      });
  };
};

export const fetchMvpsSuccess = (mvps, userKey, trackerKey, trackerName) => {
  return {
    type: actionTypes.FETCH_MVPS_SUCCESS,
    payload: {
      mvps: mvps,
      userKey: userKey,
      trackerKey: trackerKey,
      trackerName: trackerName,
      lastUpdated: new Date()
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

//----- CREATE

export const createNewMvpTracker = (
  userId,
  token,
  trackerName,
  userKey,
  mvps,
  trackerKey
) => {
  return dispatch => {
    dispatch(createMvpsStart(mvps));
    const queryParams = "?auth=" + token;
    const objToCast = { mvps: mvps, trackerName: trackerName };
    if (trackerKey) {
      mainAxios
        .put(
          "/users/" +
            userKey +
            "/trackers/" +
            trackerKey +
            ".json" +
            queryParams,
          objToCast
        )
        .then(res => {
          dispatch(createMvpsSuccess());
          dispatch(
            fetchMvpsFromDb(token, userId, trackerName, true, res.data.name)
          );
        })
        .catch(errorCaught => {
          dispatch(createMvpsFailed(errorCaught));
        });
    } else {
      mainAxios
        .post("/users/" + userKey + "/trackers.json" + queryParams, objToCast)
        .then(res => {
          dispatch(createMvpsSuccess());
          dispatch(
            fetchMvpsFromDb(token, userId, trackerName, true, res.data.name)
          );
        })
        .catch(errorCaught => {
          dispatch(createMvpsFailed(errorCaught));
        });
    }
  };
};

export const createMvpsSuccess = () => {
  return {
    type: actionTypes.CREATE_MVPS_SUCCESS
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

export const createMvpsStart = mvps => {
  return {
    type: actionTypes.CREATE_MVPS_START,
    payload: {
      mvps: mvps
    }
  };
};

//----- SAVE //----- USED BY ADD NEW MVP ENTRY ASWELL

export const saveAllMvpsHandler = (
  userKey,
  token,
  trackerKey,
  mvps,
  trackerName
) => {
  return dispatch => {
    const url = "/users/" + userKey + "/trackers/" + trackerKey + ".json";
    const queryParams = "?auth=" + token;
    mainAxios
      .put(url + queryParams, { mvps: mvps, trackerName: trackerName })
      .then(res => {
        dispatch(saveMvpsSuccess(mvps));
      })
      .catch(err => {
        dispatch(saveMvpsFail(err));
      });
  };
};

export const saveMvpsToDbAndFetch = (
  userId,
  userKey,
  token,
  trackerKey,
  mvps,
  trackerName
) => {
  return dispatch => {
    dispatch(saveMvpsStart());
    const url = "/users/" + userKey + "/trackers/" + trackerKey + ".json";
    const queryParams = "?auth=" + token;
    mainAxios
      .put(url + queryParams, { mvps: mvps, trackerName: trackerName })
      .then(res => {
        dispatch(saveMvpsSuccess(null));
        dispatch(
          fetchMvpsFromDb(token, userId, trackerName, false, trackerKey)
        );
      })
      .catch(err => {
        dispatch(saveMvpsFail(err));
      });
  };
};

export const saveMvpsSuccess = mvps => {
  return {
    type: actionTypes.SAVE_MVPS_SUCCESS,
    payload: {
      mvps: mvps
    }
  };
};

export const saveMvpsFail = error => {
  return {
    type: actionTypes.SAVE_MVPS_FAIL,
    payload: {
      error: error
    }
  };
};

export const saveMvpsStart = () => {
  return {
    type: actionTypes.SAVE_MVPS_START
  };
};

//----- KILL AND UPDATE SINGLE MVP

export const saveSingleMvpToDb = (
  minuteAgo,
  mvpKey,
  userKey,
  token,
  trackerKey,
  mvp
) => {
  return dispatch => {
    // const mvpToCast = mvp
    //   ? {
    //       ...mvp,
    //       timeKilled: new Date(new Date().getTime() - Number(minuteAgo) * 60000)
    //     }
    //   : null;
    const mvpToCast = mvp
      ? {
          id: mvp.id,
          name: mvp.name,
          map: mvp.map,
          maxSpawn: mvp.maxSpawn,
          minSpawn: mvp.minSpawn,
          timeKilled: new Date(new Date().getTime() - Number(minuteAgo) * 60000)
        }
      : {};

    dispatch(saveSingleMvpStart());
    const url =
      "/users/" +
      userKey +
      "/trackers/" +
      trackerKey +
      "/mvps/" +
      mvpKey +
      ".json";
    const queryParams = "?auth=" + token;
    mainAxios
      .put(url + queryParams, mvpToCast)
      .then(res => {
        dispatch(saveSingleMvpSuccess(mvpToCast.timeKilled, mvpKey));
      })
      .catch(err => {
        dispatch(saveSingleMvpFail(err));
      });
  };
};

export const saveSingleMvpStart = () => {
  return {
    type: actionTypes.SAVE_SINGLE_MVP_START
  };
};

export const saveSingleMvpFail = err => {
  return {
    type: actionTypes.SAVE_SINGLE_MVP_FAIL,
    payload: {
      error: err
    }
  };
};

export const saveSingleMvpSuccess = (timeKilled, mvpKey) => {
  return {
    type: actionTypes.SAVE_SINGLE_MVP_SUCCESS,
    payload: {
      mvpId: mvpKey,
      timeKilled: timeKilled
    }
  };
};

//----- DELETE TRACKER

export const deleteTracker = (userKey, trackerKey, token, userId) => {
  return dispatch => {
    dispatch(deleteTrackerStart);
    const url = "/users/" + userKey + "/trackers/" + trackerKey + ".json";
    const queryParams = "?auth=" + token;
    mainAxios
      .put(url + queryParams, { mvps: null, trackerName: null })
      .then(res => {
        dispatch(deleteTrackerSuccess("Tracker has been successfully deleted"));
        localStorage.removeItem("activeTrackerKey");
        localStorage.removeItem("activeTrackerName");
        dispatch(fetchMvpsFromDb(token, userId, null, false, null));
      })
      .catch(err => {
        dispatch(saveMvpsFail(err));
      });
  };
};

export const deleteTrackerStart = () => {
  return {
    type: actionTypes.DELETE_TRACKER_START
  };
};
export const deleteTrackerSuccess = message => {
  return {
    type: actionTypes.DELETE_TRACKER_SUCCESS,
    payload: {
      message: message,
      mvps: null,
      activeTrackerKey: null,
      activeTrackerName: null,
      allTrackers: null
    }
  };
};
export const deleteTrackerFail = error => {
  return {
    type: actionTypes.DELETE_TRACKER_FAIL,
    payload: {
      error: error
    }
  };
};

//----- FETCH USER KEY

export const fetchUserKey = (userId, token) => {
  return dispatch => {
    dispatch(fetchUserKeyStart());
    const queryParams =
      "?auth=" + token + '&orderBy="userId"&equalTo="' + userId + '"';
    mainAxios
      .get("users.json" + queryParams)
      .then(res => {
        let allTrackerIdentifiers = [];
        Object.keys(res.data).map(userKey => {
          const trackerObj = res.data[userKey].trackers;
          localStorage.setItem("userKey", userKey);
          Object.keys(trackerObj).map(trackerKey => {
            allTrackerIdentifiers.push({
              trackerName: trackerObj[trackerKey].trackerName,
              trackerKey: trackerKey
            });
            dispatch(fetchUserKeySuccess(userKey));
          });
          dispatch(storeAllTrackers(allTrackerIdentifiers));
        });
      })
      .catch(error => {
        return dispatch(fetchUserKeyFail(error));
      });
  };
};

export const fetchUserKeyStart = () => {
  return {
    type: actionTypes.FETCH_USER_KEY_START
  };
};

export const fetchUserKeySuccess = userKey => {
  return {
    type: actionTypes.FETCH_USER_KEY_SUCCESS,
    payload: {
      userKey: userKey
    }
  };
};

export const fetchUserKeyFail = error => {
  return {
    type: actionTypes.FETCH_USER_KEY_FAIL,
    payload: {
      error: error
    }
  };
};

//----- MISC

export const updateCurrentTime = () => {
  return {
    type: actionTypes.UPDATE_CURRENT_TIME,
    payload: {
      currentTime: new Date()
    }
  };
};

export const storeAllTrackers = trackerArr => {
  return {
    type: actionTypes.STORE_ALL_TRACKERS,
    payload: {
      trackers: trackerArr
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
  // TODO combine this to a single action for entirity of mvps
  const fixedKilledAt = killedAt
    ? new Date(JSON.parse(JSON.stringify(killedAt)))
    : null;
  const differenceInMinutes = ((currentTime - fixedKilledAt) / 60000).toFixed(
    0
  );
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

export const calculateTimeToSpawnAllMvps = (currentTime, mvps) => {
  let mvpsToCast = {};
  Object.keys(mvps).map(mvpKey => {
    const mvp = { ...mvps[mvpKey] };
    const fixedKilledAt = mvp.timeKilled
      ? new Date(JSON.parse(JSON.stringify(mvp.timeKilled)))
      : null;
    const differenceInMinutes = ((currentTime - fixedKilledAt) / 60000).toFixed(
      0
    );
    const minTillSpawn =
      differenceInMinutes > 1440
        ? "Unknown"
        : mvp.minSpawn - differenceInMinutes;
    const maxTillSpawn =
      differenceInMinutes > 1440
        ? "Unknown"
        : mvp.maxSpawn - differenceInMinutes;
    mvpsToCast[mvpKey] = {
      ...mvps[mvpKey],
      maxTillSpawn: maxTillSpawn,
      minTillSpawn: minTillSpawn,
      timeKilled: fixedKilledAt
    };
  });
  return {
    type: actionTypes.CALCULATE_TIME_ALL_MVPS,
    payload: {
      mvps: mvpsToCast
    }
  };
};

export const clearMvpMessage = () => {
  return {
    type: actionTypes.CLEAR_MVP_MESSAGE
  };
};
