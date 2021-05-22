import React from "react";

export const appData = {
  App: {
    Projects: [
      {
        Name: "Untitled",
        Url: "", //wss://echo.websocket.org
        Requests: []
      }
    ]
  },
  InitialState: true
};

const AppContext = React.createContext(appData);
export default AppContext;
