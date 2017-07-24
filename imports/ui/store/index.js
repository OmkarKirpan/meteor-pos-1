import { applyMiddleware, compose, createStore } from "redux";

import { LANGUAGE } from "../configs";
import { client } from "../graphql";
import { createBrowserHistory } from "history";
import { logger } from "redux-logger";
import { rootReducer } from "../reducers";
import { routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";

const initialState = {};
const history = createBrowserHistory();
const routingMiddleware = routerMiddleware(history);
const middlewares = [thunk, routingMiddleware, client.middleware(), logger];
const enhancers = [];
const composedEnhancers = compose(
    applyMiddleware(...middlewares),
    ...enhancers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const store = createStore(rootReducer, initialState, composedEnhancers);

export { history, store };
