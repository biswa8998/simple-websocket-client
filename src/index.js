import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";

import App from "./App";

const rootElement = document.getElementById("root");

const ele = (
  <Provider store={store}>
    <App test="test" />
  </Provider>
);
ReactDOM.render(ele, rootElement);
