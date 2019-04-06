import * as actionTypes from "./actionTypes";
import vanillaAxios from "axios";
import mvpAxios from "../../axios-mvps";
import Cookies from 'js-cookie';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId, isPremium) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: {
      idToken: token,
      userId: userId,
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
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const checkPremium = userId => {};

export const auth = (email, password, isSignup) => {
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
        const queryParams =
          "?auth=" +
          response.data.idToken +
          '&orderBy="userId"&equalTo="' +
          response.data.localId +
          '"';
        mvpAxios
          .get("accountData.json" + queryParams)
          .then(secondRes => {
            // console.log(secondRes.data[0]);
            Object.keys(secondRes.data).length === 0
              ? dispatch(
                  authSuccess(
                    response.data.idToken,
                    response.data.localId,
                    false
                  )
                )
              : Object.keys(secondRes.data).map(key => {
                  dispatch(
                    authSuccess(
                      response.data.idToken,
                      response.data.localId,
                      secondRes.data[key].premium
                    )
                  );
                });
          })
          .catch(error => {
            dispatch(
              authSuccess(response.data.idToken, response.data.localId, false)
            );
          });
        dispatch(checkAuthTimeout(response.data.expiresIn));
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
        dispatch(logout());
      } else {
        const userId = localStorage.getItem("userId");
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
