import * as actionTypes from "./actionTypes";
import mainAxios from "../../axios-mvps";

//----- FETCH
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
  mvp,
  eventType,
  note
) => {
  return dispatch => {
    let mvpToCast;
    if (eventType === "killed" || eventType === "delete") {
      mvpToCast = mvp
        ? {
            id: mvp.id,
            name: mvp.name,
            map: mvp.map,
            maxSpawn: mvp.maxSpawn,
            minSpawn: mvp.minSpawn,
            notification: mvp.notification,
            timeKilled: new Date(
              new Date().getTime() - Number(minuteAgo) * 60000
            )
          }
        : {};
    } else if (
      eventType === "toggleNotification" ||
      eventType === "saveNote" ||
      eventType === "saveTomb"
    ) {
      mvpToCast = {
        id: mvp.id,
        name: mvp.name,
        map: mvp.map,
        maxSpawn: mvp.maxSpawn,
        minSpawn: mvp.minSpawn,
        notification: mvp.notification,
        timeKilled: mvp.timeKilled,
        note: note,
        tombRatioX: mvp.tombRatioX,
        tombRatioY: mvp.tombRatioY,
      };
    }
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
        let mvpToUpdate = res.data
          ? {
              ...res.data
            }
          : null;
        dispatch(saveSingleMvpSuccess(mvpToUpdate, mvpKey));
        dispatch(
          calculateTimeToSpawn(
            mvpToUpdate.timeKilled,
            mvpToUpdate.minSpawn,
            mvpToUpdate.maxSpawn,
            new Date(),
            mvpKey
          )
        );
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

export const saveSingleMvpSuccess = (mvp, mvpKey) => {
  return {
    type: actionTypes.SAVE_SINGLE_MVP_SUCCESS,
    payload: {
      mvpId: mvpKey,
      mvp: mvp
    }
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
          if (trackerObj) {
            Object.keys(trackerObj).map(trackerKey => {
              allTrackerIdentifiers.push({
                trackerName: trackerObj[trackerKey].trackerName,
                trackerKey: trackerKey
              });
            });
          }
          if (allTrackerIdentifiers.length === 0) {
            allTrackerIdentifiers = null;
          }
          dispatch(fetchUserKeySuccess(userKey));
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

//----- NOTIFICATION SETTINGS - SAVE

export const saveNotificationsLocal = (notiTypeKey, itemToCast) => {
  return dispatch => {
    dispatch(saveNotificationSettingsSuccess(notiTypeKey, itemToCast));
  };
};

export const saveNotificationSettings = (
  token,
  userKey,
  notiTypeKey,
  itemToCast
) => {
  return dispatch => {
    dispatch(saveNotificationSettingsStart());
    const url = "/users/" + userKey + "/settings/" + notiTypeKey + ".json";
    const queryParams = "?auth=" + token;
    mainAxios
      .put(url + queryParams, itemToCast)
      .then(res => {
        dispatch(saveNotificationSettingsSuccess(notiTypeKey, itemToCast));
      })
      .catch(err => {
        dispatch(saveNotificationSettingsFail(err));
      });
  };
};

export const addInitialNotificationSettings = (token, userKey) => {
  return dispatch => {
    dispatch(saveNotificationSettingsStart());
    const url = "/users/" + userKey + "/settings" + ".json";
    const queryParams = "?auth=" + token;
    const itemToCast = {
      notiMode: { mode: "all" },
      notiSound: { mode: true },
      notiType: { onMax: false, onMin: true, tenTillMin: false },
      theme: { name: "default" }
    };
    mainAxios
      .put(url + queryParams, itemToCast)
      .then(res => {
        dispatch(
          saveNotificationSettingsSuccess("notiMode", itemToCast.notiMode)
        );
        dispatch(
          saveNotificationSettingsSuccess("notiType", itemToCast.notiType)
        );
        dispatch(
          saveNotificationSettingsSuccess("notiSound", itemToCast.notiSound)
        );
        dispatch(saveThemeSettings("default"));
      })
      .catch(err => {
        dispatch(saveNotificationSettingsFail(err));
      });
  };
};

export const saveNotificationSettingsStart = () => {
  return {
    type: actionTypes.SAVE_NOTIFICATIONS_START
  };
};

export const saveNotificationSettingsSuccess = (notiTypeKey, itemToCast) => {
  return {
    type: actionTypes.SAVE_NOTIFICATIONS_SUCCESS,
    payload: {
      notiTypeKey: notiTypeKey,
      itemToCast: itemToCast
    }
  };
};

export const saveNotificationSettingsFail = error => {
  return {
    type: actionTypes.SAVE_NOTIFICATIONS_FAIL,
    payload: {
      error: error
    }
  };
};

//----- INITIALIZE SETTINGS

export const initializeSettings = (
  userId,
  token,
  notiSettingsLocal,
  themeLocal
) => {
  return dispatch => {
    dispatch(initializeSettingsStart());
    const queryParams =
      "?auth=" + token + '&orderBy="userId"&equalTo="' + userId + '"';
    if (
      notiSettingsLocal.notiSound !== null &&
      notiSettingsLocal.notiMode !== null &&
      notiSettingsLocal.notiType !== null &&
      themeLocal
    ) {
      dispatch(initializeSettingsSuccess(notiSettingsLocal, themeLocal));
    } else {
      mainAxios
        .get("users.json" + queryParams)
        .then(res => {
          Object.keys(res.data).map(userKey => {
            const settingsFromServer = res.data[userKey].settings
              ? { ...res.data[userKey].settings }
              : null;
            const castedSettings =
              settingsFromServer && settingsFromServer.theme
                ? {
                    notiSound: {
                      mode: settingsFromServer.notiSound.mode,
                      volume: settingsFromServer.notiSound.volume || 0.5
                    },
                    notiMode: {
                      mode: settingsFromServer.notiMode.mode
                    },
                    notiType: {
                      onMax: settingsFromServer.notiType.onMax,
                      onMin: settingsFromServer.notiType.onMin,
                      tenTillMin: settingsFromServer.notiType.tenTillMin
                    },
                    theme: {
                      name: settingsFromServer.theme
                        ? settingsFromServer.theme.name
                        : null
                    }
                  }
                : null;
            if (castedSettings && castedSettings.theme.name) {
              const notiSoundToCast =
                notiSettingsLocal.notiSound !== null
                  ? notiSettingsLocal.notiSound
                  : castedSettings.notiSound;
              const notiModeToCast =
                notiSettingsLocal.notiMode !== null
                  ? notiSettingsLocal.notiMode
                  : castedSettings.notiMode;
              const notiTypeToCast =
                notiSettingsLocal.notiType !== null
                  ? notiSettingsLocal.notiType
                  : castedSettings.notiType;
              const themeToCast = themeLocal
                ? themeLocal
                : castedSettings.theme.name;
              const finalNotiSettToCast = {
                notiSound: notiSoundToCast,
                notiMode: notiModeToCast,
                notiType: notiTypeToCast
              };
              dispatch(
                initializeSettingsSuccess(finalNotiSettToCast, themeToCast)
              );
            } else {
              dispatch(addInitialNotificationSettings(token, userKey));
            }
          });
        })
        .catch(error => {
          return dispatch(initializeSettingsFail(error));
        });
    }
  };
};

export const initializeSettingsStart = () => {
  return {
    type: actionTypes.INITIALIZE_SETTINGS_START
  };
};

export const initializeSettingsSuccess = (notificationSettings, theme) => {
  return {
    type: actionTypes.INITIALIZE_SETTINGS_SUCCESS,
    payload: {
      notificationSettings: notificationSettings,
      theme: theme
    }
  };
};

export const initializeSettingsFail = error => {
  return {
    type: actionTypes.INITIALIZE_SETTINGS_FAIL,
    payload: {
      error: error
    }
  };
};

//----- THEME SETTINGS SAVE

export const saveThemeLocal = theme => {
  return dispatch => {
    dispatch(saveThemeSettingsSuccess(theme));
  };
};

export const saveThemeSettings = (token, userKey, theme) => {
  return dispatch => {
    dispatch(saveThemeSettingsStart());
    const url = "/users/" + userKey + "/settings/theme.json";
    const queryParams = "?auth=" + token;
    mainAxios
      .put(url + queryParams, { name: theme })
      .then(res => {
        dispatch(saveThemeSettingsSuccess(theme));
      })
      .catch(err => {
        dispatch(saveThemeSettingsFail(err));
      });
  };
};

export const saveThemeSettingsStart = () => {
  return {
    type: actionTypes.SAVE_THEME_START
  };
};

export const saveThemeSettingsSuccess = theme => {
  return {
    type: actionTypes.SAVE_THEME_SUCCESS,
    payload: {
      theme: theme
    }
  };
};

export const saveThemeSettingsFail = error => {
  return {
    type: actionTypes.SAVE_THEME_FAIL,
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
