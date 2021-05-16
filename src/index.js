import ReactDOM from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");
// console.log(App);

const ele = <App test="test" />;
console.log(ele);
ReactDOM.render(ele, rootElement);
