import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { Grid } from "@material-ui/core";
import AppStyles from "../Style";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as Types from "../types/actionTypes";
import * as Actions from "../actions";

function AppConnection(props) {
  const classes = AppStyles();
  const { projects, selectedProject, savedProjects } = props;
  const connectionState = projects[selectedProject].ConnectionState;
  const projectUrl = projects[selectedProject].Url;
  const [url, setUrl] = useState("");

  const connected = connectionState === Types.CONNECTED;

  useEffect(() => {
    setUrl(projectUrl);
  }, [projectUrl]);

  const [urlError, setUrlError] = useState(false);

  const onClickConnect = url => {
    if (connectionState === Types.DISCONNECTED) {
      props.createWebsocket({ url, selectedProject });
    }
    if (connectionState === Types.CONNECTED) {
      props.closeWebsocket({
        project: projects[selectedProject],
        projectId: selectedProject
      });
    }
  };

  const saveNewProject = url => {
    if (url.trim().length === 0) {
      setUrlError(true);

      return;
    }
    props.showCreateProjectModal({
      url,
      selectedProject
    });
  };

  return (
    <Grid id="app-request-wrapper" className="app-request-wrapper">
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <TextField
          autoFocus
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
          disabled={connectionState !== Types.DISCONNECTED}
        />
        <Button
          variant="contained"
          color={connected ? "secondary" : "primary"}
          classes={{ root: classes.buttonConnect }}
          onClick={() => {
            onClickConnect(url);
          }}
          disabled={url.length === 0 || connectionState === Types.CONNECTING}
        >
          {connected ? "DISCONNECT" : "CONNECT"}
        </Button>
      </Grid>
      <p className="save-this-request">
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={() => {
            saveNewProject(url);
          }}
        >
          {savedProjects ? "NEW PROJECT" : "SAVE PROJECT"}
        </Button>
      </p>
    </Grid>
  );
}

const mapStateToProps = state => {
  const { projects, selectedProject, savedProjects } = state;
  return { projects, selectedProject, savedProjects };
};

const mapDispatchToProps = dispatch => {
  return {
    createWebsocket: data => dispatch(Actions.createWebsocket(data)),
    closeWebsocket: data => dispatch(Actions.closeWebsocket(data)),
    showCreateProjectModal: data =>
      dispatch(Actions.showCreateProjectModal(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppConnection);
