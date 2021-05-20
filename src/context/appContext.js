import React from "react";

export const appData = {
  App: {
    Projects: [
      {
        Name: "Untitled",
        Url: "",
        Requests: []
      }
    ]
  },
  InitialState: true
};

const AppContext = React.createContext(appData);
export default AppContext;
