import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Navbar } from "react-bootstrap";
import { Grid } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import AppProjects from "./components/AppProjects";
import AppRequests from "./components/AppRequests";
import { EditDialog } from "./components/Dialogs";
import AppContext, { appData } from "./context/appContext";
import Types from "./dataType";
import AppConnection from "./components/AppConnection";
import AppPayload from "./components/AppPayload";
import { MessageLists } from "./components/Lists";

import { setLocalStorage, getLocalStorage, getTime } from "./Util";

import { makeStyles } from "@material-ui/core/styles";

import WS from "./Websocket";

// let appSocket = null;
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
  const [existingAppData, setExistingAppData] = useState(appData);
  const [pIndex, setProjectIndex] = useState(0);
  const [rIndex, setRequestIndex] = useState(0);

  useEffect(() => {
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

    setExistingAppData(applicationData);
    setProjectIndex(preSelectedProj);
    setRequestIndex(preSelectedRequest);
  }, []);

  const [appUrl, setAppUrl] = useState("");

  const [lastAction, setLastAction] = useState({});
  const [showProjectEditDialog, setShowProjectEditDialog] = useState(false);
  const [showRequestEditDialog, setShowRequestEditDialog] = useState(false);

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

  function toggleProjectEditDialog() {
    setShowProjectEditDialog(!showProjectEditDialog);
  }

  function toggleRequestEditDialog() {
    setShowRequestEditDialog(!showRequestEditDialog);
  }

  function addMessage(message) {
    message["time"] = getTime();
    // appMessagesGlobal.splice(0, 0, message);

    const newData = { ...existingAppData };
    newData.App.Projects[pIndex].Messages.splice(0, 0, message);
    setExistingAppData(newData);
  }

  function saveNewProject(url) {
    setAppUrl(url);
    setLastAction({ type: Types.NEW_PROJECT, data: null });
    toggleProjectEditDialog();
  }

  function onConnectSuccess(event) {
    addMessage({
      type: Types.RECEIVED_MESSAGE,
      message: "Connected to url " + appUrl
    });

    const newData = { ...existingAppData };
    newData.App.Projects[pIndex].Socket.ConnectionStatus = true;
    setExistingAppData(newData);
  }

  function onCloseSuccess(event) {
    addMessage({
      type: Types.RECEIVED_MESSAGE,
      message: "Connection closed to url " + appUrl
    });
    const newData = { ...existingAppData };
    newData.App.Projects[pIndex].Socket.Connection = null;
    newData.App.Projects[pIndex].Socket.ConnectionStatus = false;
    setExistingAppData(newData);
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
    if (!existingAppData.App.Projects[pIndex].Socket.ConnectionStatus) {
      // request for connection
      addMessage({
        type: Types.SENT_MESSAGE,
        message: "Connecting to url " + url
      });

      // Make Websocket instance
      const appSocket = new WS(url);
      appSocket.addOnOpen(onConnectSuccess);
      appSocket.addOnClose(onCloseSuccess);
      appSocket.addOnMessage(onWsMessage);
      appSocket.addOnError(onError);

      const newData = { ...existingAppData };
      newData.App.Projects[pIndex].Socket.Connection = appSocket;
      setExistingAppData(newData);
    } else {
      addMessage({
        type: Types.SENT_MESSAGE,
        message: "Close connection to url " + url
      });
      existingAppData.App.Projects[pIndex].Socket.Connection.close();
    }

    setAppUrl(url);
  }

  function onClickSend(payload) {
    if (
      existingAppData.App.Projects[pIndex].Socket.ConnectionStatus &&
      payload.trim().length > 0
    ) {
      // send message to websocket
      existingAppData.App.Projects[pIndex].Socket.Connection.send(payload);

      addMessage({
        type: Types.SENT_MESSAGE,
        message: payload
      });
    }
  }

  function addRequestToProject(payload) {
    setLastAction({ type: Types.NEW_REQUEST, data: payload });
    toggleRequestEditDialog();
  }

  function onProjectClick(i) {
    const actualProjectIndex = existingAppData.InitialState ? i : i + 1;

    if (actualProjectIndex !== pIndex) {
      setRequestIndex(0);
      setProjectIndex(actualProjectIndex);
    }
  }

  function onRequestClick(i) {
    setRequestIndex(i);
  }

  function updateAppData(data) {
    if (data.type === Types.NEW_PROJECT) {
      // Check if first project being saved
      let newData = { ...existingAppData };
      let newProject = { ...newData.App.Projects[0] };
      newData.App.Projects.push(newProject);
      if (newData.App.Projects[0].Socket.ConnectionStatus) {
        newData.App.Projects[newData.App.Projects.length - 1].Name =
          data.project.name;
        newData.App.Projects[newData.App.Projects.length - 1].Url =
          data.project.url;
      } else {
        newData.App.Projects[newData.App.Projects.length - 1].Name =
          data.project.name;
        newData.App.Projects[newData.App.Projects.length - 1].Url =
          data.project.url;

        newData.App.Projects[newData.App.Projects.length - 1]["Messages"] = [];
        newData.App.Projects[newData.App.Projects.length - 1]["Socket"] = {
          ConnectionStatus: false,
          Connection: null
        };
      }

      newData.InitialState = false;
      saveAppData(newData);
      setProjectIndex(newData.App.Projects.length - 1);
      // if (newData.App.Projects.length == 2) setProjectIndex(1);
    } else if (data.type === Types.EDIT_PROJECT) {
      let newData = { ...existingAppData };
      newData.App.Projects[pIndex].Name = data.project.name;
      newData.App.Projects[pIndex].Url = data.project.url;
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

      setProjectIndex(0);
      saveAppData(newData);
    } else if (data.type === Types.NEW_REQUEST) {
      let newData = Object.assign({}, existingAppData);

      // Check if this is unsaved untitled project
      let requestArray = Object.assign(
        [],
        newData.App.Projects[pIndex].Requests
      );

      requestArray.push({
        Name: data.project.name,
        Payload: data.project.url
      });
      newData.App.Projects[pIndex].Requests = requestArray;
      saveAppData(newData);
    } else if (data.type === Types.EDIT_REQUEST) {
      let newData = { ...existingAppData };
      newData.App.Projects[pIndex].Requests[rIndex].Name = data.project.name;
      newData.App.Projects[pIndex].Requests[rIndex].Payload = data.project.url;
      saveAppData(newData);
    } else if (data.type === Types.DELETE_REQUEST) {
      let newData = { ...existingAppData };
      newData.App.Projects[pIndex].Requests = Object.assign(
        [],
        existingAppData.App.Projects[pIndex].Requests
      );
      newData.App.Projects[pIndex].Requests.splice(data.id, 1);

      setRequestIndex(0);

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

  console.log(
    existingAppData,
    pIndex,
    existingAppData.App.Projects[pIndex].Messages
  );
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
                setLastAction({ type: Types.EDIT_PROJECT, data: null });
                toggleProjectEditDialog();
              }}
              onProjectDelete={data => {
                updateAppData({ type: Types.DELETE_PROJECT, id: data });
              }}
              editAndDelete={existingAppData.App.Projects.length > 1}
              selectedProjectIndex={
                existingAppData.InitialState ? pIndex : pIndex - 1
              }
            />
            {/* List all the requests of selected project */}
            <AppRequests
              requests={existingAppData.App.Projects[pIndex].Requests}
              onRequestClick={onRequestClick}
              onRequestEdit={data => {
                setLastAction({ type: Types.EDIT_REQUEST, data: null });
                toggleRequestEditDialog();
              }}
              onRequestDelete={data => {
                updateAppData({
                  type: Types.DELETE_REQUEST,
                  id: data.id,
                  project: pIndex
                });
              }}
              selectedRequestIndex={rIndex}
            />
            {/* Request and response */}
            <Grid item lg={8} xs={12} className="app-columns">
              <Grid id="connection-section" className="project-column-wrapper">
                <AppConnection
                  saveNewProject={saveNewProject}
                  onClickConnect={onClickConnect}
                  urlValue={existingAppData.App.Projects[pIndex].Url}
                  connected={
                    existingAppData.App.Projects[pIndex].Socket.ConnectionStatus
                  }
                />
                <AppPayload
                  onClickSend={onClickSend}
                  payload={
                    existingAppData.App.Projects[pIndex].Requests[rIndex]
                      ? existingAppData.App.Projects[pIndex].Requests[rIndex]
                          .Payload
                      : ""
                  }
                  connected={
                    existingAppData.App.Projects[pIndex].Socket.ConnectionStatus
                  }
                  addToProject={addRequestToProject}
                  hasProject={!existingAppData.InitialState}
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
                    <MessageLists
                      messages={existingAppData.App.Projects[pIndex].Messages}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {showProjectEditDialog && (
            <EditDialog
              open={showProjectEditDialog}
              closeDialog={toggleProjectEditDialog}
              projectId={pIndex}
              type={lastAction.type}
              title={
                lastAction.type === Types.NEW_PROJECT
                  ? "Create New Project"
                  : "Edit Project"
              }
              labelOne="Project Name"
              labelTwo="Url"
              leftButtonText={
                lastAction.type === Types.NEW_PROJECT ? "CREATE" : "UPDATE"
              }
              description="Use a distinct project name to save configuration"
              projectName={
                lastAction.type === Types.NEW_PROJECT
                  ? ""
                  : existingAppData.App.Projects[pIndex].Name
              }
              projectUrl={
                lastAction.type === Types.NEW_PROJECT
                  ? appUrl
                  : existingAppData.App.Projects[pIndex].Url
              }
            />
          )}
          {showRequestEditDialog && (
            <EditDialog
              open={showRequestEditDialog}
              closeDialog={toggleRequestEditDialog}
              type={lastAction.type}
              projectId={rIndex}
              title={
                lastAction.type === Types.NEW_REQUEST
                  ? "Add Request"
                  : "Edit Request"
              }
              labelOne="Request Name"
              labelTwo="Payload"
              leftButtonText={
                lastAction.type === Types.NEW_REQUEST ? "CREATE" : "UPDATE"
              }
              description="Use a distinct request name to save configuration"
              projectName={
                lastAction.type === Types.NEW_REQUEST
                  ? ""
                  : existingAppData.App.Projects[pIndex].Requests[rIndex].Name
              }
              projectUrl={
                lastAction.type === Types.NEW_REQUEST
                  ? lastAction.data
                  : existingAppData.App.Projects[pIndex].Requests[rIndex]
                      .Payload
              }
            />
          )}
        </div>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
