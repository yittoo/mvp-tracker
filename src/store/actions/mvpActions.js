import * as actionTypes from "./actionTypes";
import mainAxios from "../../axios-mvps";

//----- FETCH
export const fetchMvpsFromDb = (
  token,
  userId,
  trackerName,
  isLoader,
  inputTrackerKey,
  inputUserKey
) => {
  return dispatch => {
    if (isLoader) {
      dispatch(fetchMvpsStart());
    }
    if (!inputTrackerKey || !inputUserKey) {
      const queryParams =
        "?auth=" + token + '&orderBy="userId"&equalTo="' + userId + '"';
      mainAxios
        .get("users.json" + queryParams)
        .then(res => {
          // eslint-disable-next-line
          Object.keys(res.data).map(userKey => {
            const trackerObj = res.data[userKey].trackers;
            let trackersLength = Object.keys(trackerObj).length;
            if (!trackerObj) {
              return dispatch(fetchMvpsSuccess(null, userKey, null, null));
            } else {
              const allTrackerIdentifiers = [];
              // eslint-disable-next-line
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
                  const logs = trackerObj[trackerKey].logs;
                  localStorage.setItem("activeTrackerName", liveTrackerName);
                  localStorage.setItem("activeTrackerKey", trackerKey);
                  localStorage.setItem("userKey", userKey);
                  dispatch(
                    fetchMvpsSuccess(
                      trackerObj[trackerKey].mvps,
                      userKey,
                      trackerKey,
                      liveTrackerName,
                      logs
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
              dispatch(fetchAllTrackersSuccess(allTrackerIdentifiers));
            }
          });
        })
        .catch(error => {
          return dispatch(fetchMvpsFailed(error));
        });
    } else {
      const url =
        "/users/" + inputUserKey + "/trackers/" + inputTrackerKey + ".json";
      const queryParams = "?auth=" + token;
      mainAxios
        .get(url + queryParams)
        .then(res => {
          localStorage.setItem("activeTrackerName", res.data.trackerName);
          localStorage.setItem("activeTrackerKey", inputTrackerKey);
          localStorage.setItem("userKey", inputUserKey);
          dispatch(
            fetchMvpsSuccess(
              res.data.mvps,
              inputUserKey,
              inputTrackerKey,
              res.data.trackerName,
              res.data.logs
            )
          );
          dispatch(calculateTimeToSpawnAllMvps(new Date(), res.data.mvps));
        })
        .catch(err => {
          dispatch(fetchMvpsFailed(err));
        });
    }
  };
};

export const fetchMvpsSuccess = (
  mvps,
  userKey,
  trackerKey,
  trackerName,
  logs
) => {
  return {
    type: actionTypes.FETCH_MVPS_SUCCESS,
    payload: {
      mvps: mvps,
      userKey: userKey,
      logs: logs || {},
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
  trackerKey,
  allTrackers
) => {
  return dispatch => {
    dispatch(createMvpsStart(mvps));
    const queryParams = "?auth=" + token;
    const objToCast = {
      mvps: mvps,
      trackerName: trackerName.substring(0, 36),
      logs: {}
    };
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
            fetchMvpsFromDb(
              token,
              userId,
              trackerName.substring(0, 36),
              true,
              trackerKey,
              userKey
            )
          );
          if (allTrackers) {
            let allTrackersToCast = [...allTrackers];
            allTrackersToCast.push({
              trackerName: trackerName,
              trackerKey: trackerKey
            });
            dispatch(fetchAllTrackersSuccess(allTrackersToCast));
          }
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
            fetchMvpsFromDb(
              token,
              userId,
              trackerName,
              true,
              res.data.name,
              userKey
            )
          );
          if (allTrackers) {
            let allTrackersToCast = [...allTrackers];
            allTrackersToCast.push({
              trackerName: trackerName,
              trackerKey: res.data.name
            });
            dispatch(fetchAllTrackersSuccess(allTrackersToCast));
          }
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
      .put(url + queryParams, {
        mvps: mvps,
        trackerName: trackerName.substring(0, 36)
      })
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
  trackerName,
  logs,
  newLog
) => {
  return dispatch => {
    dispatch(saveMvpsStart());
    const url = "/users/" + userKey + "/trackers/" + trackerKey + ".json";
    const queryParams = "?auth=" + token;
    mainAxios
      .put(url + queryParams, {
        mvps: mvps,
        trackerName: trackerName.substring(0, 36),
        logs: logs
      })
      .then(res => {
        dispatch(saveMvpsSuccess(null));
        dispatch(
          fetchMvpsFromDb(
            token,
            userId,
            trackerName.substring(0, 36),
            false,
            trackerKey,
            userKey
          )
        );
        dispatch(saveLogs(userKey, token, trackerKey, logs, newLog));
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
            id: mvp.id ? mvp.id.toString().substring(0, 6) : null,
            name: mvp.name.substring(0, 48),
            map: mvp.map.substring(0, 24),
            maxSpawn: mvp.maxSpawn.toString().substring(0, 8),
            minSpawn: mvp.minSpawn.toString().substring(0, 8),
            notification: mvp.notification,
            killedBy: localStorage.getItem("nickname").substring(0, 36),
            timeKilled: new Date(
              new Date().getTime() -
                Number(minuteAgo.toString().substring(0, 6)) * 60000
            ),
            timeKilledBeforeEdit: mvp.timeKilled
          }
        : null;
    } else if (
      eventType === "toggleNotification" ||
      eventType === "saveNote" ||
      eventType === "saveTomb"
    ) {
      mvpToCast = {
        id: mvp.id ? mvp.id.toString().substring(0, 6) : null,
        name: mvp.name.substring(0, 48),
        map: mvp.map.substring(0, 24),
        maxSpawn: mvp.maxSpawn.toString().substring(0, 8),
        minSpawn: mvp.minSpawn.toString().substring(0, 8),
        notification: mvp.notification,
        timeKilled: mvp.timeKilled,
        killedBy: mvp.killedBy || "Undefined",
        note: note ? note.substring(0, 250) : null,
        tombRatioX: mvp.tombRatioX,
        tombRatioY: mvp.tombRatioY,
        timeKilledBeforeEdit: mvp.timeKilledBeforeEdit
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
      .put(url + queryParams, mvpToCast || {})
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

export const undoMvpChange = (mvpKey, userKey, token, mvp, trackerKey) => {
  return dispatch => {
    dispatch(saveSingleMvpStart());
    const mvpToCast = {
      ...mvp,
      timeKilled: mvp.timeKilledBeforeEdit || null
    };
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
        const mvpToUpdate = { ...res.data };
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

export const deleteTracker = (
  userKey,
  trackerKey,
  token,
  userId,
  allTrackers
) => {
  return dispatch => {
    dispatch(deleteTrackerStart);
    const url = "/users/" + userKey + "/trackers/" + trackerKey + ".json";
    const queryParams = "?auth=" + token;
    mainAxios
      .put(url + queryParams, { mvps: null, trackerName: null, logs: null })
      .then(res => {
        let allTrackersToFilter = [...allTrackers];
        let filteredTrackers = allTrackersToFilter.filter(trackerObj => {
          return trackerObj.trackerKey !== trackerKey;
        });
        dispatch(fetchAllTrackersSuccess(filteredTrackers));
        dispatch(deleteTrackerSuccess("Tracker has been successfully deleted"));
        localStorage.removeItem("activeTrackerKey");
        localStorage.removeItem("activeTrackerName");
        dispatch(fetchMvpsFromDb(token, userId, null, false, null, null));
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
        // eslint-disable-next-line
        Object.keys(res.data).map(userKey => {
          const trackerObj = res.data[userKey].trackers;
          localStorage.setItem("userKey", userKey);
          if (trackerObj) {
            // eslint-disable-next-line
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
          dispatch(fetchAllTrackersSuccess(allTrackerIdentifiers));
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
    const url = "/users/" + userKey + "/settings.json";
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
        dispatch(fetchUserKeySuccess(userKey));
        dispatch(saveThemeLocal("default"));
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
  themeLocal,
  inputUserKey
) => {
  return dispatch => {
    dispatch(initializeSettingsStart());
    if (
      notiSettingsLocal.notiSound !== null &&
      notiSettingsLocal.notiMode !== null &&
      notiSettingsLocal.notiType !== null &&
      themeLocal &&
      (inputUserKey || localStorage.getItem("userKey"))
    ) {
      dispatch(
        initializeSettingsSuccess(
          notiSettingsLocal,
          themeLocal,
          inputUserKey || localStorage.getItem("userKey")
        )
      );
    } else {
      if (!inputUserKey) {
        const queryParams =
          "?auth=" + token + '&orderBy="userId"&equalTo="' + userId + '"';
        mainAxios
          .get("users.json" + queryParams)
          .then(res => {
            // eslint-disable-next-line
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
                  initializeSettingsSuccess(
                    finalNotiSettToCast,
                    themeToCast,
                    userKey
                  )
                );
              } else {
                dispatch(addInitialNotificationSettings(token, userKey));
              }
            });
          })
          .catch(error => {
            return dispatch(initializeSettingsFail(error));
          });
      } else {
        const url = "/users/" + inputUserKey + "/settings.json";
        const queryParams = "?auth=" + token;
        mainAxios
          .get(url + queryParams)
          .then(res => {
            const settingsFromServer = res.data ? { ...res.data } : null;
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
                initializeSettingsSuccess(
                  finalNotiSettToCast,
                  themeToCast,
                  inputUserKey
                )
              );
            } else {
              dispatch(addInitialNotificationSettings(token, inputUserKey));
            }
          })
          .catch(error => {
            return dispatch(initializeSettingsFail(error));
          });
      }
    }
  };
};

export const initializeSettingsStart = () => {
  return {
    type: actionTypes.INITIALIZE_SETTINGS_START
  };
};

export const initializeSettingsSuccess = (
  notificationSettings,
  theme,
  userKey
) => {
  return {
    type: actionTypes.INITIALIZE_SETTINGS_SUCCESS,
    payload: {
      notificationSettings: notificationSettings,
      theme: theme,
      userKey: userKey
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
      .put(url + queryParams, { name: theme.substring(0, 48) })
      .then(res => {
        dispatch(saveThemeSettingsSuccess(theme.substring(0, 48)));
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

//----- LOGS

export const saveLogs = (userKey, token, trackerKey, logs, newLog) => {
  return dispatch => {
    dispatch(saveLogsStart());
    const postUrl =
      "/users/" + userKey + "/trackers/" + trackerKey + "/logs.json";
    const queryParams = "?auth=" + token;
    mainAxios
      .post(postUrl + queryParams, { ...newLog })
      .then(res => {
        const newLogKey = res.data.name;
        let logsToCast = { ...logs, [newLogKey]: newLog };
        let logsKeysAsArr = Object.keys(logsToCast);
        if (logsKeysAsArr.length < 100) {
          dispatch(saveLogsSuccess(logsToCast));
        } else {
          const timesToLoop = logsKeysAsArr.length - 100;
          for (let i = 0; i < timesToLoop; i++) {
            let oldestTimeInMilisecObj = {
              key: "",
              value: 999999999999999,
              index: null
            };
            // eslint-disable-next-line
            logsKeysAsArr.map((logKey, index) => {
              if (
                oldestTimeInMilisecObj.value >
                new Date(logsToCast[logKey].date).getTime()
              ) {
                oldestTimeInMilisecObj = {
                  key: logKey,
                  value: new Date(logsToCast[logKey].date).getTime(),
                  index: index
                };
              }
              if (index === logsKeysAsArr.length - 1) {
                const objToCast = { ...oldestTimeInMilisecObj };
                oldestTimeInMilisecObj = {
                  key: "",
                  value: 999999999999999,
                  index: null
                };
                logsKeysAsArr.splice(objToCast.index, 1);
                delete logsToCast[objToCast.key];
                const delUrl =
                  "/users/" +
                  userKey +
                  "/trackers/" +
                  trackerKey +
                  "/logs/" +
                  objToCast.key +
                  ".json";
                mainAxios
                  .put(delUrl + queryParams, {})
                  .then(res => {})
                  .catch(err => {
                    dispatch(saveLogsFail(err));
                  });
              }
            });
            if (i + 1 === timesToLoop) {
              dispatch(saveLogsSuccess(logsToCast));
            }
          }
        }
      })
      .catch(err => {
        dispatch(saveLogsFail(err));
      });
  };
};

export const saveLogsStart = () => {
  return {
    type: actionTypes.SAVE_LOGS_START
  };
};

export const saveLogsSuccess = logs => {
  return {
    type: actionTypes.SAVE_LOGS_SUCCESS,
    payload: {
      logs
    }
  };
};

export const saveLogsFail = err => {
  return {
    type: actionTypes.SAVE_LOGS_FAIL,
    payload: {
      error: err
    }
  };
};

//----- DELETE ACCOUNT DATA

export const deleteAccountDbData = (token, userKey) => {
  return dispatch => {
    dispatch(saveThemeSettingsStart());
    const url = "/users/" + userKey + ".json";
    const queryParams = "?auth=" + token;
    mainAxios
      .put(url + queryParams, {})
      .then(res => {
        dispatch(deleteAccountSuccess());
        localStorage.clear();
      })
      .catch(err => {
        dispatch(deleteAccountFail());
      });
  };
};

export const deleteAccountStart = () => {
  return {
    type: actionTypes.DELETE_ACCOUNT_START
  };
};

export const deleteAccountSuccess = () => {
  return {
    type: actionTypes.DELETE_ACCOUNT_SUCCESS
  };
};

export const deleteAccountFail = error => {
  return {
    type: actionTypes.DELETE_ACCOUNT_FAIL,
    payload: {
      error: error
    }
  };
};

//----- FETCH ALL TRACKERS

export const fetchAllTrackers = (token, userKey, userId) => {
  return dispatch => {
    dispatch(fetchAllTrackersStart());
    if (!userKey) {
      const queryParams =
        "?auth=" + token + '&orderBy="userId"&equalTo="' + userId + '"';
      mainAxios
        .get("users.json" + queryParams)
        .then(res => {
          let allTrackerIdentifiers = [];
          // eslint-disable-next-line
          Object.keys(res.data.trackers).map(trackerKey => {
            allTrackerIdentifiers.push({
              trackerName: res.data.trackers[trackerKey].trackerName,
              trackerKey: trackerKey
            });
          });
          dispatch(fetchAllTrackersSuccess(allTrackerIdentifiers));
        })
        .catch(err => {
          dispatch(fetchAllTrackersFail(err));
        });
    } else {
      const url = "/users/" + userKey + "/trackers.json";
      const queryParams = "?auth=" + token;
      mainAxios
        .get(url + queryParams)
        .then(res => {
          let allTrackerIdentifiers = [];
          // eslint-disable-next-line
          Object.keys(res.data).map(trackerKey => {
            allTrackerIdentifiers.push({
              trackerName: res.data[trackerKey].trackerName,
              trackerKey: trackerKey
            });
          });
          dispatch(fetchAllTrackersSuccess(allTrackerIdentifiers));
        })
        .catch(err => {
          dispatch(fetchAllTrackersFail(err));
        });
    }
  };
};

export const fetchAllTrackersStart = () => {
  return {
    type: actionTypes.FETCH_ALL_TRACKERS_START
  };
};

export const fetchAllTrackersSuccess = trackerArr => {
  return {
    type: actionTypes.FETCH_ALL_TRACKERS_SUCCESS,
    payload: {
      trackers: trackerArr
    }
  };
};

export const fetchAllTrackersFail = error => {
  return {
    type: actionTypes.FETCH_ALL_TRACKERS_FAIL,
    payload: {
      error
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

export const changeDefaultTracker = (trackerKey, trackerName) => {
  return {
    type: actionTypes.CHANGE_DEFAULT_TRACKER,
    payload: {
      trackerKey,
      trackerName
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
  // eslint-disable-next-line
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
