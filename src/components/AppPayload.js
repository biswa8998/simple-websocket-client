import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { Grid, Typography } from "@material-ui/core";
import AppStyles from "../Style";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import * as Actions from "../actions";
import * as ActionTypes from "../types/actionTypes";

function AppPayload(props) {
  const [payload, setPayload] = useState(props.payload);
  const [showError, setShowError] = useState(false);
  const classes = AppStyles();

  const { projects, selectedProject } = props;

  useEffect(() => {
    setPayload(props.payload);
  }, [props.payload]);

  const isUrlConnected = projects[selectedProject].ConnectionState;

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="flex-start"
      className="app-payload-wrapper"
      id="app-payload-wrapper"
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
            onClick={() => {
              props.sendMessageToWebsocket({
                message: payload,
                projectId: selectedProject,
                project: projects[selectedProject]
              });
            }}
            disabled={
              isUrlConnected === ActionTypes.DISCONNECTED ||
              payload.trim().length === 0
            }
          >
            SEND
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              props.showCreateRequestModal({
                payload: payload,
                projectId: props.selectedProject
              });
            }}
            disabled={payload.trim().length === 0}
            style={{ marginLeft: "20px" }}
          >
            ADD TO PROJECT
          </Button>
          {showError ? (
            <Typography
              variant="caption"
              color="error"
              classes={{ root: classes.urlErrorText }}
            >
              Create a project first.
            </Typography>
          ) : null}
        </p>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = state => {
  return {
    projects: state.projects,
    selectedProject: state.selectedProject
  };
};
const mapStateToDispatch = dispatch => {
  return {
    sendMessageToWebsocket: data =>
      dispatch(Actions.sendMessageToWebsocket(data)),
    showCreateRequestModal: data =>
      dispatch(Actions.showCreateRequestModal(data))
  };
};

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(AppPayload);
