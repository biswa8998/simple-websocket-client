import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Navbar } from "react-bootstrap";
import { Grid } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import AppProjects from "./components/AppProjects";
import AppRequests from "./components/AppRequests";
import { SaveProjectDialog, EditDialog } from "./components/Dialogs";
import AppContext, { appData } from "./context/appContext";
import Types from "./dataType";
import AppConnection from "./components/AppConnection";
import AppPayload from "./components/AppPayload";
import { MessageLists } from "./components/Lists";

import { setLocalStorage, getLocalStorage, getTime } from "./Util";

import { makeStyles } from "@material-ui/core/styles";

import WS from "./Websocket";

let appSocket = null;
let appMessagesGlobal = [];

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#ff8d3a",
      dark: "#002884",
      contrastText: "#fff",
      hover: "#fff"
    },
    secondary: {
      main: "#eb4848"
    }
  }
});

function AppNavbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Simple WebSocket Client</Navbar.Brand>
    </Navbar>
  );
}

function App() {
  const savedData = getLocalStorage("data");
  let applicationData,
    preSelectedProj = 0,
    preSelectedRequest = 0;

  if (savedData) {
    applicationData = savedData;
    if (applicationData.App.Projects.length > 1) {
      preSelectedProj = 1;
      if (applicationData.App.Projects[1].Requests.length > 0) {
        preSelectedRequest = 0;
      }
    }
  } else {
    applicationData = appData;
  }

  const [existingAppData, setExistingAppData] = useState(applicationData);

  const [appUrl, setAppUrl] = useState("");

  const [connected, setConnected] = useState(false);

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showProjectEditDialog, setShowProjectEditDialog] = useState(false);
  const [showRequestEditDialog, setShowRequestEditDialog] = useState(false);

  const [selectedProjectIndex, setSelectedProjectIndex] = useState(
    preSelectedProj
  );
  const [selectedRequestIndex, setSelectedRequestIndex] = useState(
    preSelectedRequest
  );

  // eslint-disable-next-line
  const [refresh, setRefresh] = useState(false);

  const AppData = {
    data: existingAppData,
    updateData: updateAppData
  };

  function saveAppData(data) {
    setLocalStorage(data).then(() => {
      setExistingAppData(data);
    });
  }

  function toggleSaveDialog() {
    setShowSaveDialog(!showSaveDialog);
  }

  function toggleProjectEditDialog() {
    setShowProjectEditDialog(!showProjectEditDialog);
  }

  function toggleRequestEditDialog() {
    setShowRequestEditDialog(!showRequestEditDialog);
  }

  function addMessage(message) {
    message["time"] = getTime();
    appMessagesGlobal.splice(0, 0, message);
  }

  function onClickSave(url) {
    setAppUrl(url);
    toggleSaveDialog();
  }

  function onConnectSuccess(event) {
    addMessage({
      type: Types.RECEIVED_MESSAGE,
      message: "Connected to url " + appUrl
    });
    setConnected(true);
  }

  function onCloseSuccess(event) {
    appSocket = null;
    addMessage({
      type: Types.RECEIVED_MESSAGE,
      message: "Connection closed to url " + appUrl
    });
    setConnected(false);
  }

  function onError(event) {
    console.log(event);
  }

  function onWsMessage(event) {
    addMessage({
      type: Types.RECEIVED_MESSAGE,
      message: event.data
    });
    setRefresh(event.timeStamp);
  }

  function onClickConnect(url) {
    if (!connected) {
      // request for connection
      addMessage({
        type: Types.SENT_MESSAGE,
        message: "Connecting to url " + url
      });

      // Make Websocket instance
      appSocket = new WS(url);
      appSocket.addOnOpen(onConnectSuccess);
      appSocket.addOnClose(onCloseSuccess);
      appSocket.addOnMessage(onWsMessage);
      appSocket.addOnError(onError);
    } else {
      addMessage({
        type: Types.SENT_MESSAGE,
        message: "Close connection to url " + url
      });
      appSocket.close();
    }

    setAppUrl(url);
  }

  function onClickSend(payload) {
    if (connected && payload.trim().length > 0) {
      let newData = Object.assign({}, existingAppData);

      // Check if this is unsaved untitled project
      if (newData.App.Projects.length === 1) {
      }

      let requestArray = Object.assign(
        [],
        newData.App.Projects[selectedProjectIndex].Requests
      );

      requestArray.splice(0, 0, {
        Name: payload.substr(0, 11),
        Payload: payload
      });
      newData.App.Projects[selectedProjectIndex].Requests = requestArray;

      // send message to websocket
      appSocket.send(payload);

      addMessage({
        type: Types.SENT_MESSAGE,
        message: payload
      });
      saveAppData(newData);
    }
  }

  function onProjectClick(i) {
    const actualProjectIndex = existingAppData.InitialState ? i : i + 1;
    setSelectedProjectIndex(actualProjectIndex);
  }

  function onRequestClick(i) {
    setSelectedRequestIndex(i);
  }

  function updateAppData(data) {
    if (data.type === Types.NEW_PROJECT) {
      // Check if first project being saved
      let newData = { ...existingAppData };
      let newProject = Object.assign({}, newData.App.Projects[0]);
      newData.App.Projects.push(newProject);
      newData.App.Projects[newData.App.Projects.length - 1].Name =
        data.projectName;
      newData.App.Projects[newData.App.Projects.length - 1].Url = appUrl;

      if (newData.App.Projects.length === 2) {
        // if already requests are made, copy them in newly created project
        newData.App.Projects[
          newData.App.Projects.length - 1
        ].Requests = Object.assign([], newData.App.Projects[0].Requests);

        // and clear the projects from untitled
        newData.App.Projects[0].Requests = [];
      } else {
        newData.App.Projects[newData.App.Projects.length - 1].Requests = [];
      }

      newData.InitialState = false;
      saveAppData(newData);
      setSelectedProjectIndex(newData.App.Projects.length - 1);
      // if (newData.App.Projects.length == 2) setSelectedProjectIndex(1);
    } else if (data.type === Types.EDIT_PROJECT) {
      let newData = { ...existingAppData };
      newData.App.Projects[selectedProjectIndex].Name = data.project.name;
      newData.App.Projects[selectedProjectIndex].Url = data.project.url;
      saveAppData(newData);
    } else if (data.type === Types.DELETE_PROJECT) {
      const actualProjectIndex = existingAppData.InitialState
        ? data.id
        : data.id + 1;

      let newData = { ...existingAppData };

      newData.App.Projects.splice(actualProjectIndex, 1);

      if (newData.App.Projects.length === 1) {
        newData.InitialState = true;
      }

      setSelectedProjectIndex(0);
      saveAppData(newData);
    } else if (data.type === Types.EDIT_REQUEST) {
      let newData = { ...existingAppData };
      newData.App.Projects[selectedProjectIndex].Requests[
        selectedRequestIndex
      ].Name = data.project.name;
      newData.App.Projects[selectedProjectIndex].Requests[
        selectedRequestIndex
      ].Payload = data.project.url;
      saveAppData(newData);
    } else if (data.type === Types.DELETE_REQUEST) {
      let newData = { ...existingAppData };
      newData.App.Projects[selectedProjectIndex].Requests = Object.assign(
        [],
        existingAppData.App.Projects[selectedProjectIndex].Requests
      );
      newData.App.Projects[selectedProjectIndex].Requests.splice(data.id, 1);

      setSelectedRequestIndex(0);

      saveAppData(newData);
    }
  }

  function getHeightStyle() {
    const a = document.getElementById("connection-section")
      ? document.getElementById("connection-section").offsetHeight
      : 0;
    const b = document.getElementById("app-request-wrapper")
      ? document.getElementById("app-request-wrapper").offsetHeight
      : 0;
    const c = document.getElementById("app-payload-wrapper")
      ? document.getElementById("app-payload-wrapper").offsetHeight
      : 0;
    const height = a - (b + c);
    const AppStyles = makeStyles(theme => ({
      msgSectionHeight: {
        height: height - 20,
        overflowY: "auto"
      }
    }));
    return AppStyles;
  }

  console.log(existingAppData, selectedProjectIndex, appMessagesGlobal);
  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={AppData}>
        <div>
          <AppNavbar></AppNavbar>
          <Grid container>
            {/* List all the projects */}
            <AppProjects
              projects={
                existingAppData.App.Projects.length > 1
                  ? existingAppData.App.Projects.slice(1)
                  : existingAppData.App.Projects
              }
              onProjectClick={onProjectClick}
              onProjectEdit={data => {
                toggleProjectEditDialog();
              }}
              onProjectDelete={data => {
                updateAppData({ type: Types.DELETE_PROJECT, id: data });
              }}
              editAndDelete={existingAppData.App.Projects.length > 1}
              selectedProjectIndex={
                existingAppData.InitialState
                  ? selectedProjectIndex
                  : selectedProjectIndex - 1
              }
            />
            {/* List all the requests of selected project */}
            <AppRequests
              requests={
                existingAppData.App.Projects[selectedProjectIndex].Requests
              }
              onRequestClick={onRequestClick}
              onRequestEdit={data => {
                toggleRequestEditDialog();
              }}
              onRequestDelete={data => {
                updateAppData({
                  type: Types.DELETE_REQUEST,
                  id: data.id,
                  project: selectedProjectIndex
                });
              }}
              selectedRequestIndex={selectedRequestIndex}
            />
            {/* Request and response */}
            <Grid item lg={8} xs={12} className="app-columns">
              <Grid id="connection-section" className="project-column-wrapper">
                <AppConnection
                  onClickSave={onClickSave}
                  onClickConnect={onClickConnect}
                  urlValue={
                    existingAppData.App.Projects[selectedProjectIndex].Url
                  }
                  connected={connected}
                />
                <AppPayload
                  onClickSend={onClickSend}
                  payload={
                    existingAppData.App.Projects[selectedProjectIndex].Requests[
                      selectedRequestIndex
                    ]
                      ? existingAppData.App.Projects[selectedProjectIndex]
                          .Requests[selectedRequestIndex].Payload
                      : ""
                  }
                  connected={connected}
                />

                <Grid className="divider" />
                <Grid
                  container
                  className="app-messages"
                  classes={{
                    root: getHeightStyle()().msgSectionHeight
                  }}
                >
                  <Grid container>
                    <MessageLists messages={appMessagesGlobal} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <SaveProjectDialog
            open={showSaveDialog}
            closeDialog={toggleSaveDialog}
          />
          <EditDialog
            open={showProjectEditDialog}
            closeDialog={toggleProjectEditDialog}
            type="project"
            projectId={selectedProjectIndex}
            title="Edit Project"
            description="Use a distinct project name to save configuration"
            projectName={
              existingAppData.App.Projects[selectedProjectIndex].Name
            }
            projectUrl={existingAppData.App.Projects[selectedProjectIndex].Url}
          />
          <EditDialog
            open={showRequestEditDialog}
            closeDialog={toggleRequestEditDialog}
            type="request"
            projectId={selectedRequestIndex}
            title="Edit Request"
            description="Use a distinct request name to save configuration"
            projectName={
              existingAppData.App.Projects[selectedProjectIndex].Requests[
                selectedRequestIndex
              ]
                ? existingAppData.App.Projects[selectedProjectIndex].Requests[
                    selectedRequestIndex
                  ].Name
                : ""
            }
            projectUrl={
              existingAppData.App.Projects[selectedProjectIndex].Requests[
                selectedRequestIndex
              ]
                ? existingAppData.App.Projects[selectedProjectIndex].Requests[
                    selectedRequestIndex
                  ].Payload
                : ""
            }
          />
        </div>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
