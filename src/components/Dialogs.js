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
  const [inputBoxOneValue, setInputBoxOne] = useState(props.inputBoxOneValue);
  const [inputBoxTwoValue, setInputBoxTwo] = useState(props.inputBoxTwoValue);
  const [inputBoxOneError, setInputBoxOneError] = useState(false);

  const value = useContext(AppContext);

  useEffect(() => {
    setInputBoxOne(props.inputBoxOneValue);
    setInputBoxTwo(props.inputBoxTwoValue);
  }, [props.inputBoxOneValue, props.inputBoxTwoValue]);

  function saveProject() {
    if (inputBoxOneValue.trim().length === 0) {
      setInputBoxOneError(true);
      return;
    }

    value.updateData({
      type: props.type,
      project: {
        name: inputBoxOneValue,
        url: inputBoxTwoValue
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
          autoFocus={
            props.type === Types.NEW_REQUEST || props.type === Types.NEW_PROJECT
          }
          margin="dense"
          label={props.labelOne}
          fullWidth
          value={inputBoxOneValue}
          error={inputBoxOneError}
          onChange={e => {
            setInputBoxOne(e.target.value);
          }}
          onClick={() => {
            setInputBoxOneError(false);
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
            value={inputBoxTwoValue}
            spellCheck="false"
            onChange={e => {
              setInputBoxTwo(e.target.value);
            }}
            disabled={props.canChangeValue}
            autoFocus={
              props.type === Types.EDIT_REQUEST ||
              props.type === Types.EDIT_PROJECT
            }
          />
        ) : (
          <TextField
            variant="outlined"
            type="text"
            margin="dense"
            label={props.labelTwo}
            fullWidth
            value={inputBoxTwoValue}
            onChange={e => {
              setInputBoxTwo(e.target.value);
            }}
            disabled={!props.contentChangeEnabled}
            autoFocus={
              props.type === Types.EDIT_REQUEST ||
              props.type === Types.EDIT_PROJECT
            }
          />
        )}
      </DialogContent>
    </DialogSlide>
  );
}

export function DeleteDialog(props) {
  const value = useContext(AppContext);

  // useEffect(() => {
  //   setInputBoxOne(props.inputBoxOneValue);
  //   setInputBoxTwo(props.inputBoxTwoValue);
  // }, [props.inputBoxOneValue, props.inputBoxTwoValue]);

  function deleteItem() {
    value.updateData({
      type: props.type,
      id: props.itemId
    });

    props.closeDialog();
  }

  return (
    <DialogSlide
      open={props.open}
      title={props.title}
      leftButtonText={props.leftButtonText}
      leftButtonAction={deleteItem}
      rightButtonText="CANCEL"
      rightButtonAction={props.closeDialog}
      closeDialog={props.closeDialog}
    >
      <DialogContent>
        <DialogContentText id="dialog-slide-description">
          {props.description}
        </DialogContentText>
      </DialogContent>
    </DialogSlide>
  );
}
