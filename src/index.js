import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";


import thunk from 'redux-thunk';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import mvpReducers from "./store/reducers/mvpReducers";
import authReducers from './store/reducers/authReducers';

const composeEnhancers = process.env.NODE_ENV === "development" ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const rootReducer = combineReducers({
  mvp: mvpReducers,
  auth: authReducers
})

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
