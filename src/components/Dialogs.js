import React, { useState, useEffect, useContext } from "react";
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

export function EditDialog(props) {
  const [projectName, setProjectName] = useState(props.projectName);
  const [url, setUrl] = useState(props.projectUrl);
  const [projectNameError, setProjectNameError] = useState(false);

  const value = useContext(AppContext);

  useEffect(() => {
    setProjectName(props.projectName);
    setUrl(props.projectUrl);
  }, [props.projectName, props.projectUrl]);

  function saveProject() {
    if (projectName.trim().length === 0) {
      setProjectNameError(true);
      return;
    }

    value.updateData({
      type: props.type,
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
      leftButtonText={props.leftButtonText}
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
          label={props.labelOne}
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
        {props.type === Types.EDIT_REQUEST ||
        props.type === Types.NEW_REQUEST ? (
          <TextField
            id="outlined-multiline-static"
            label={props.labelTwo}
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
        ) : (
          <TextField
            variant="outlined"
            type="text"
            autoFocus
            margin="dense"
            label={props.labelTwo}
            fullWidth
            value={url}
            onChange={e => {
              setUrl(e.target.value);
            }}
          />
        )}
      </DialogContent>
    </DialogSlide>
  );
}
