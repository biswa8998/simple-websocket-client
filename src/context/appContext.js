import React from "react";

export const appData = {
  App: {
    Projects: [
      {
        Name: "Untitled",
        Url: "", //wss://echo.websocket.org
        Requests: [],
        Socket: {
          ConnectionStatus: false,
          Connection: null
        },
        Messages: []
      }
    ]
  },
  InitialState: true
};

const AppContext = React.createContext(appData);
export default AppContext;
