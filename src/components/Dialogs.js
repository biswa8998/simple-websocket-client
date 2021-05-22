import React, { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

import TextField from "@material-ui/core/TextField";

import AppContext from "../context/appContext";

import Types from "../dataType";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DialogSlide(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.closeDialog}
        aria-labelledby="dialog-slide-title"
        aria-describedby="dialog-slide-description"
        onBackdropClick={props.closeDialog}
        onEscapeKeyDown={props.closeDialog}
      >
        <DialogTitle id="dialog-slide-title">{props.title}</DialogTitle>
        {props.children}

        <DialogActions>
          <Button onClick={props.leftButtonAction} color="primary">
            {props.leftButtonText}
          </Button>
          <Button onClick={props.rightButtonAction} color="primary">
            {props.rightButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export function SaveProjectDialog(props) {
  const [projectName, setProjectName] = useState("");
  const [projectNameError, setProjectNameError] = useState(false);
  const refProjectName = useRef(null);

  useEffect(() => {
    if (props.open) {
      getFocus();
    }
  }, [props.open]);

  function getFocus() {
    refProjectName.current.focus();
  }

  return (
    <AppContext.Consumer>
      {value => {
        function saveProject() {
          if (projectName.trim().length === 0) {
            setProjectNameError(true);
            return;
          }

          value.updateData({
            type: Types.NEW_PROJECT,
            projectName: projectName
          });

          // clean up
          setProjectName("");
          props.closeDialog();
        }

        return (
          <DialogSlide
            open={props.open}
            title="Save Project"
            leftButtonText="SAVE"
            leftButtonAction={saveProject}
            rightButtonText="CANCEL"
            rightButtonAction={props.closeDialog}
            closeDialog={props.closeDialog}
          >
            <DialogContent>
              <DialogContentText id="dialog-slide-description">
                Enter a distinct project name to save current configuration
              </DialogContentText>

              <TextField
                inputRef={refProjectName}
                variant="outlined"
                type="text"
                margin="dense"
                id="project-name"
                label="Project Name"
                fullWidth
                value={projectName}
                error={projectNameError}
                onChange={e => {
                  setProjectName(e.target.value);
                }}
                onClick={() => {
                  setProjectNameError(false);
                }}
                onKeyPress={e => {
                  if (e.key.toLowerCase() === "enter") {
                    saveProject();
                    props.closeDialog();
                  }
                }}
              />
            </DialogContent>
          </DialogSlide>
        );
      }}
    </AppContext.Consumer>
  );
}

export function EditDialog(props) {
  const [projectName, setProjectName] = useState(props.projectName);
  const [url, setUrl] = useState(props.projectUrl);
  const [projectNameError, setProjectNameError] = useState(false);

  useEffect(() => {
    setProjectName(props.projectName);
    setUrl(props.projectUrl);
  }, [props.projectName, props.projectUrl]);

  return (
    <AppContext.Consumer>
      {value => {
        function saveProject() {
          if (projectName.trim().length === 0) {
            setProjectNameError(true);
            return;
          }

          value.updateData({
            type:
              props.type === "project"
                ? Types.EDIT_PROJECT
                : Types.EDIT_REQUEST,
            project: {
              name: projectName,
              url: url
            }
          });

          props.closeDialog();
        }

        return (
          <DialogSlide
            open={props.open}
            title={props.title}
            leftButtonText="UPDATE"
            leftButtonAction={saveProject}
            rightButtonText="CANCEL"
            rightButtonAction={props.closeDialog}
            closeDialog={props.closeDialog}
          >
            <DialogContent>
              <DialogContentText id="dialog-slide-description">
                {props.description}
              </DialogContentText>

              <TextField
                variant="outlined"
                type="text"
                autoFocus
                margin="dense"
                label="Project Name"
                fullWidth
                value={projectName}
                error={projectNameError}
                onChange={e => {
                  setProjectName(e.target.value);
                }}
                onClick={() => {
                  setProjectNameError(false);
                }}
              />
              {props.type === "project" ? (
                <TextField
                  variant="outlined"
                  type="text"
                  autoFocus
                  margin="dense"
                  label="Url"
                  fullWidth
                  value={url}
                  onChange={e => {
                    setUrl(e.target.value);
                  }}
                />
              ) : (
                <TextField
                  id="outlined-multiline-static"
                  label="Payload"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth={true}
                  value={url}
                  spellCheck="false"
                  onChange={e => {
                    setUrl(e.target.value);
                  }}
                />
              )}
            </DialogContent>
          </DialogSlide>
        );
      }}
    </AppContext.Consumer>
  );
}

export function ProjectDeleteDialog(props) {
  const [projectName, setProjectName] = useState(props.projectName);
  const [url, setUrl] = useState(props.projectUrl);
  const [projectNameError, setProjectNameError] = useState(false);

  useEffect(() => {
    setProjectName(props.projectName);
    setUrl(props.projectUrl);
  }, [props.projectName, props.projectUrl]);

  return (
    <AppContext.Consumer>
      {value => {
        function saveProject() {
          if (projectName.trim().length === 0) {
            setProjectNameError(true);
            return;
          }

          value.updateData({
            type: Types.EDIT_PROJECT,
            project: {
              name: projectName,
              url: url
            }
          });

          props.closeDialog();
        }

        return (
          <DialogSlide
            open={props.open}
            title="Edit Project"
            leftButtonText="UPDATE"
            leftButtonAction={saveProject}
            rightButtonText="CANCEL"
            rightButtonAction={props.closeDialog}
          >
            <DialogContent>
              <DialogContentText id="dialog-slide-description">
                Use a distinct project name to save configuration
              </DialogContentText>

              <TextField
                variant="outlined"
                type="text"
                autoFocus
                margin="dense"
                id="delete-project-name"
                label="Project Name"
                fullWidth
                value={projectName}
                error={projectNameError}
                onChange={e => {
                  setProjectName(e.target.value);
                }}
                onClick={() => {
                  setProjectNameError(false);
                }}
              />
              <TextField
                variant="outlined"
                type="text"
                autoFocus
                margin="dense"
                id="delete-project-url"
                label="Url"
                fullWidth
                value={url}
                onChange={e => {
                  setUrl(e.target.value);
                }}
              />
            </DialogContent>
          </DialogSlide>
        );
      }}
    </AppContext.Consumer>
  );
}
