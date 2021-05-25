import React from "react";
import AppStyles from "../Style";

import { IconButton } from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import RemoveIcon from "@material-ui/icons/Remove";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CodeIcon from "@material-ui/icons/Code";

function ButtonWithIcon(props) {
  const Icon = props.icon;
  return (
    <IconButton
      className={props.class}
      component="span"
      size="small"
      classes={{
        root: props.buttonRootStyle
      }}
      title={props.buttonTitle}
      onClick={props.onClick}
    >
      {Icon}
    </IconButton>
  );
}

export function DeleteButtonIcon(props) {
  const classes = AppStyles();
  return (
    <ButtonWithIcon
      icon={<DeleteIcon />}
      buttonRootStyle={classes.buttonDelete}
      buttonTitle={`Delete ${props.buttonTitle}`}
      onClick={props.onClick}
    />
  );
}

export function EditButtonIcon(props) {
  const classes = AppStyles();
  return (
    <ButtonWithIcon
      icon={<EditIcon />}
      buttonRootStyle={classes.buttonEdit}
      buttonTitle={`Edit ${props.buttonTitle}`}
      onClick={props.onClick}
    />
  );
}

export function RemoveButtonIcon(props) {
  const classes = AppStyles();
  return (
    <ButtonWithIcon
      icon={<RemoveIcon />}
      class=""
      buttonRootStyle={classes.columnHeaderIcon}
      buttonTitle=""
    />
  );
}

export function CopyButton(props) {
  const classes = AppStyles();
  return (
    <ButtonWithIcon
      icon={<FileCopyIcon classes={{ root: classes.messageHeaderIcons }} />}
      class=""
      buttonRootStyle={classes.columnHeaderIcon}
      buttonTitle="Copy to Clipboard"
      onClick={props.onClick}
    />
  );
}

export function JsonBeautyButton(props) {
  const classes = AppStyles();
  return (
    <ButtonWithIcon
      icon={<CodeIcon classes={{ root: classes.messageHeaderIcons }} />}
      class=""
      buttonRootStyle={classes.columnHeaderIcon}
      buttonTitle="Beautify"
      onClick={props.onClick}
    />
  );
}
