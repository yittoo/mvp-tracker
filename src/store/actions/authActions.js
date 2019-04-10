import * as actionTypes from "./actionTypes";
import vanillaAxios from "axios";
import mainAxios from "../../axios-mvps";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId, userKey, isPremium) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: {
      idToken: token,
      userId: userId,
      userKey: userKey,
      isPremium: isPremium
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

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        refreshLoginSession(refreshToken);
      } else {
        dispatch(logout());
      }
    }, expirationTime * 1000);
  };
};

export const createNewUserEntry = (userId, token, username) => {
  const objToCast = {
    userId: userId,
    premium: false,
    username: username
  };
  return new Promise((resolve, reject) => {
    mainAxios.post("/users.json?auth=" + token, objToCast).then(res => {
      resolve(true);
    });
  });
};

export const checkPremium = userId => {};

export const auth = (email, password, isSignup, keepLogged) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
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
        localStorage.setItem("loggedEmail", email);
        if (keepLogged) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        if (isSignup) {
          let promise = createNewUserEntry(
            response.data.localId,
            response.data.idToken,
            email
          );
          promise.then(bool => {
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn));
          });
        } else {
          dispatch(authSuccess(response.data.idToken, response.data.localId));
          dispatch(checkAuthTimeout(response.data.expiresIn));
        }
      })
      .catch(err => {
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          refreshLoginSession(refreshToken);
        } else {
          dispatch(logout());
        }
      } else {
        const userId = localStorage.getItem("userId");
        const userKey = localStorage.getItem("userKey");
        dispatch(authSuccess(token, userId, userKey));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

export const refreshLoginSession = refreshToken => {
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
  });
};

export const sendPasswordReset = email => {
  return dispatch => {
    dispatch(sendPasswordResetStart());
    const url =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=AIzaSyD0Zeimu-WY9hXaPj5A93eo6naiB8OAnGw";
    vanillaAxios
      .post(url, {
        requestType: "PASSWORD_RESET",
        email: email
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
