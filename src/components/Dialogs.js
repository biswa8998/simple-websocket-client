import React, { useState } from "react";
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
          >
            <DialogContent>
              <DialogContentText id="dialog-slide-description">
                Enter a distinct project name to save current configuration
              </DialogContentText>

              <TextField
                variant="outlined"
                type="text"
                autoFocus
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
              />
            </DialogContent>
          </DialogSlide>
        );
      }}
    </AppContext.Consumer>
  );
}
