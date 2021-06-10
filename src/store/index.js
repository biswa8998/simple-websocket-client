import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import appReducer, { initialState } from "../reducers";
import logger from "redux-logger";

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
  middlewares.push(logger);
}

const store = createStore(
  appReducer,
  initialState,
  applyMiddleware(...middlewares)
);

export default store;
