import * as actionTypes from "./actionTypes";
import vanillaAxios from "axios";
import mainAxios from "../../axios-mvps";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: {
      idToken: token,
      userId: userId
    }
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    payload: {
      error: error
    }
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  localStorage.removeItem("loggedEmail");
  localStorage.removeItem("userKey");
  localStorage.removeItem("keepLogged");
  localStorage.removeItem("refreshToken");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = (expirationTime, refreshToken) => {
  return dispatch => {
    setTimeout(() => {
      if (refreshToken) {
        dispatch(refreshLoginSession(refreshToken));
      } else {
        dispatch(logout());
      }
    }, expirationTime * 1000 - 60000);
  };
};

export const createNewUserEntry = (
  userId,
  token,
  username,
  expiresIn,
  refreshToken
) => {
  return dispatch => {
    const objToCast = {
      userId: userId,
      premium: false,
      username: username.substring(0,100),
      settings: {
        notiMode: {
          mode: "all"
        },
        notiSound: {
          mode: true,
          volume: 0.5
        },
        notiType: {
          onMax: false,
          onMin: true,
          tenTillMin: false
        },
        theme: {
          name: "default"
        }
      }
    };
    mainAxios.post("/users.json?auth=" + token, objToCast).then(res => {
      dispatch(authSuccess(token, userId));
      dispatch(checkAuthTimeout(expiresIn, refreshToken));
    });
  };
};

export const auth = (email, password, isSignup, keepLogged, nickname) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email.substring(0,100),
      password: password.toString().substring(0,32),
      returnSecureToken: true
    };
    let url =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyD0Zeimu-WY9hXaPj5A93eo6naiB8OAnGw";
    if (!isSignup) {
      url =
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD0Zeimu-WY9hXaPj5A93eo6naiB8OAnGw";
    }
    vanillaAxios
      .post(url, authData)
      .then(response => {
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("userId", response.data.localId);
        localStorage.setItem("expirationDate", expirationDate);
        localStorage.setItem("loggedEmail", email.substring(0,100));
        localStorage.setItem("nickname", nickname);
        let refreshToken;
        if (keepLogged) {
          refreshToken = response.data.refreshToken;
          localStorage.setItem("refreshToken", refreshToken);
        }
        if (isSignup) {
          dispatch(
            createNewUserEntry(
              response.data.localId,
              response.data.idToken,
              email.substring(0,100),
              response.data.expiresIn,
              refreshToken
            )
          );
        } else {
          dispatch(authSuccess(response.data.idToken, response.data.localId));
          dispatch(checkAuthTimeout(response.data.expiresIn, refreshToken));
        }
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    const nickname = localStorage.getItem("nickname");
    if (!token || !nickname) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      const refreshToken = localStorage.getItem("refreshToken");
      if (expirationDate <= new Date()) {
        if (refreshToken) {
          dispatch(refreshLoginSession(refreshToken));
        } else {
          dispatch(logout());
        }
      } else {
        const userId = localStorage.getItem("userId");
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000,
            refreshToken
          )
        );
      }
    }
  };
};

export const refreshLoginSession = refreshToken => {
  return dispatch => {
    const url =
      "https://securetoken.googleapis.com/v1/token?key=AIzaSyD0Zeimu-WY9hXaPj5A93eo6naiB8OAnGw";
    const objToCast = {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    };
    vanillaAxios.post(url, objToCast).then(response => {
      const expirationDate = new Date(
        new Date().getTime() + response.data.expires_in * 1000
      );
      localStorage.setItem("token", response.data.id_token);
      localStorage.setItem("expirationDate", expirationDate);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      dispatch(authSuccess(response.data.id_token, response.data.user_id));
      dispatch(checkAuthTimeout(response.data.expires_in, refreshToken));
    });
  };
};

export const sendPasswordReset = email => {
  return dispatch => {
    dispatch(sendPasswordResetStart());
    const url =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=AIzaSyD0Zeimu-WY9hXaPj5A93eo6naiB8OAnGw";
    vanillaAxios
      .post(url, {
        requestType: "PASSWORD_RESET",
        email: email.substring(0,100)
      })
      .then(res => {
        dispatch(
          sendPasswordResetSuccess(
            "Password reset e-mail has been sent. Please check both inbox and junk."
          )
        );
      })
      .catch(err => {
        dispatch(sendPasswordResetFail(err));
      });
  };
};

export const sendPasswordResetStart = () => {
  return {
    type: actionTypes.SEND_PASSWORD_RESET_START
  };
};

export const sendPasswordResetFail = error => {
  return {
    type: actionTypes.SEND_PASSWORD_RESET_FAIL,
    payload: {
      error: error
    }
  };
};
export const sendPasswordResetSuccess = message => {
  return {
    type: actionTypes.SEND_PASSWORD_RESET_SUCCESS,
    payload: {
      message: message
    }
  };
};

export const clearAuthMessage = () => {
  return {
    type: actionTypes.CLEAR_AUTH_MESSAGE
  };
};

export const deleteAccountData = token => {
  return dispatch => {
    dispatch(deleteAccountStart());
    const accDelUrl =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key=AIzaSyD0Zeimu-WY9hXaPj5A93eo6naiB8OAnGw";
    vanillaAxios
      .post(accDelUrl, { idToken: token })
      .then(res => {
        dispatch(deleteAccountSuccess());
      })
      .catch(err => {
        dispatch(deleteAccountFail(err));
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
