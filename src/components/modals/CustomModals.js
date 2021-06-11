import React, { useState, useEffect, useContext } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

import TextField from "@material-ui/core/TextField";

import AppContext from "../../context/appContext";

// import Types from "../../dataType";

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
        onClose={props.closeModal}
        aria-labelledby="dialog-slide-title"
        aria-describedby="dialog-slide-description"
        onBackdropClick={props.closeModal}
        onEscapeKeyDown={props.closeModal}
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

export function EditModal(props) {
  const [inputBoxOneValue, setInputBoxOne] = useState(props.inputBoxOneValue);
  const [inputBoxTwoValue, setInputBoxTwo] = useState(props.inputBoxTwoValue);
  const [inputBoxOneError, setInputBoxOneError] = useState(false);

  useEffect(() => {
    setInputBoxOne(props.inputBoxOneValue);
    setInputBoxTwo(props.inputBoxTwoValue);
  }, [props.inputBoxOneValue, props.inputBoxTwoValue]);

  function onEditConfirm() {
    if (inputBoxOneValue.trim().length === 0) {
      setInputBoxOneError(true);
      return;
    }
    props.leftButtonAction({
      name: inputBoxOneValue,
      content: inputBoxTwoValue
    });

    setInputBoxOne("");
    setInputBoxTwo("");
  }

  return (
    <DialogSlide
      open={props.open}
      title={props.title}
      leftButtonText={props.leftButtonText}
      leftButtonAction={onEditConfirm}
      rightButtonText="CANCEL"
      rightButtonAction={props.rightButtonAction}
      closeModal={props.closeModal}
    >
      <DialogContent>
        <DialogContentText id="dialog-slide-description">
          {props.description}
        </DialogContentText>
        <TextField
          variant="outlined"
          type="text"
          autoFocus={props.inputBoxOneFocus}
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
        <TextField
          label={props.labelTwo}
          multiline={props.multiline}
          rows={props.multilineRows}
          variant="outlined"
          margin="dense"
          fullWidth={true}
          value={inputBoxTwoValue}
          spellCheck="false"
          onChange={e => {
            setInputBoxTwo(e.target.value);
          }}
          disabled={props.isDisabled}
          autoFocus={props.inputBoxTwoFocus}
        />
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

    props.closeModal();
  }

  return (
    <DialogSlide
      open={props.open}
      title={props.title}
      leftButtonText={props.leftButtonText}
      leftButtonAction={deleteItem}
      rightButtonText="CANCEL"
      rightButtonAction={props.closeModal}
      closeModal={props.closeModal}
    >
      <DialogContent>
        <DialogContentText id="dialog-slide-description">
          {props.description}
        </DialogContentText>
      </DialogContent>
    </DialogSlide>
  );
}
