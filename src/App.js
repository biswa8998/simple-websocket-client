import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Navbar } from "react-bootstrap";
import { Grid, Typography } from "@material-ui/core";
import AppStyles from "./Style";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import AppProjects from "./components/AppProjects";
import AppRequests from "./components/AppRequests";
import { SaveProjectDialog } from "./components/Dialogs";
import AppContext, { appData } from "./context/appContext";
import Types from "./dataType";
import AppConnection from "./components/AppConnection";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#ff8d3a",
      dark: "#002884",
      contrastText: "#fff",
      hover: "#fff"
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
  const [appUrl, setAppUrl] = useState("");
  const [urlError, setUrlError] = useState(false);

  const [payload, setPayload] = useState("");

  const [connected, setConnected] = useState(true);

  const classes = AppStyles();
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const [existingAppData, setExistingAppData] = useState(appData);

  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [selectedRequestIndex, setSelectedRequestIndex] = useState(0);

  const AppData = {
    data: existingAppData,
    updateData: updateAppData
  };

  function toggleSaveDialog() {
    setShowSaveDialog(!showSaveDialog);
  }

  function onClickSave(url) {
    setAppUrl(url);
    toggleSaveDialog();
  }

  function onClickConnect(url) {
    setAppUrl(url);
  }

  function onClickSend() {
    if (connected && payload.trim().length > 0) {
      let newData = Object.assign({}, existingAppData);
      let requestArray = Object.assign(
        [],
        newData.App.Projects[selectedProjectIndex].Requests
      );
      requestArray.push({
        Name: payload.substr(0, 11),
        Body: payload
      });
      newData.App.Projects[selectedProjectIndex].Requests = requestArray;

      setExistingAppData(newData);
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
    // console.log("updateAppData", data);

    if (data.type === Types.NEW_PROJECT) {
      // Check if first project being saved
      let newData = { ...existingAppData };
      let newProject = Object.assign([], newData.App.Projects[0]);
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
        newData.App.Projects[0].Requests = Object.create([]);
      } else {
        newData.App.Projects[
          newData.App.Projects.length - 1
        ].Requests = Object.create([]);
      }

      newData.InitialState = false;
      setExistingAppData(newData);
      setSelectedProjectIndex(newData.App.Projects.length - 1);
      // if (newData.App.Projects.length == 2) setSelectedProjectIndex(1);
    } else if (data.type === Types.EDIT_PROJECT) {
      let newData = { ...existingAppData };
      newData.App.Projects[selectedProjectIndex].Name = data.name;
      setExistingAppData(newData);
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
      setExistingAppData(newData);
    } else if (data.type === Types.EDIT_REQUEST) {
      let newData = { ...existingAppData };
      newData.App.Projects[selectedProjectIndex].Requests[
        selectedRequestIndex
      ].Name = data.name;
      setExistingAppData(newData);
    } else if (data.type === Types.DELETE_REQUEST) {
      let newData = { ...existingAppData };
      newData.App.Projects[selectedProjectIndex].Requests = Object.assign(
        [],
        existingAppData.App.Projects[selectedProjectIndex].Requests
      );
      newData.App.Projects[selectedProjectIndex].Requests.splice(data.id, 1);

      setSelectedRequestIndex(0);

      setExistingAppData(newData);
    }
  }

  console.log(existingAppData, selectedProjectIndex);
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
                updateAppData({ type: Types.EDIT_PROJECT, name: data });
              }}
              onProjectDelete={data => {
                updateAppData({ type: Types.DELETE_PROJECT, id: data });
              }}
              editAndDelete={existingAppData.App.Projects.length > 1}
            />
            {/* List all the requests of selected project */}
            <AppRequests
              requests={
                existingAppData.App.Projects[selectedProjectIndex].Requests
              }
              onRequestClick={onRequestClick}
              onRequestEdit={data => {
                updateAppData({ type: Types.EDIT_REQUEST, name: data });
              }}
              onRequestDelete={data => {
                updateAppData({
                  type: Types.DELETE_REQUEST,
                  id: data.id,
                  project: selectedProjectIndex
                });
              }}
            />
            {/* Request and response */}
            <Grid item lg={8} xs={12} className="app-columns">
              <Grid className="project-column-wrapper">
                <AppConnection
                  onClickSave={onClickSave}
                  onClickConnect={onClickConnect}
                  urlValue={
                    existingAppData.App.Projects[selectedProjectIndex].Url
                  }
                />
                {/* <Grid className="app-request-wrapper">
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <TextField
                      id="outlined-basic"
                      label="Websocket URL"
                      variant="outlined"
                      type="text"
                      fullWidth={true}
                      value={url}
                      error={urlError}
                      onChange={e => {
                        setUrl(e.target.value);
                      }}
                      onClick={() => {
                        setUrlError(false);
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      classes={{ root: classes.buttonConnect }}
                      onClick={onClickConnect}
                      disabled={url.length === 0}
                    >
                      CONNECT
                    </Button>
                  </Grid>
                  <p className="save-this-request">
                    <Button
                      color="primary"
                      variant="outlined"
                      size="small"
                      onClick={onClickSave}
                    >
                      SAVE
                    </Button>
                    {false ? (
                      <Typography
                        variant="caption"
                        color="error"
                        classes={{ root: classes.urlErrorText }}
                      >
                        This is some text
                      </Typography>
                    ) : null}
                  </p>
                </Grid> */}
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="flex-start"
                  className="app-payload-wrapper"
                >
                  <Grid container className="input-request-payload">
                    <TextField
                      id="outlined-multiline-static"
                      label="Payload"
                      multiline
                      rows={4}
                      variant="outlined"
                      fullWidth={true}
                      value={payload}
                      spellCheck="false"
                      onChange={e => {
                        setPayload(e.target.value);
                      }}
                    />
                    <p className="save-this-request">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={onClickSend}
                      >
                        SEND
                      </Button>
                    </p>
                  </Grid>
                  <br />
                  <Grid className="divider" />
                  <Grid container className="input-request-payload">
                    Messages will appear here
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <SaveProjectDialog
            open={showSaveDialog}
            closeDialog={toggleSaveDialog}
          />
        </div>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
