import React from "react";
import AppStyles from "../Style";

import { IconButton } from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import RemoveIcon from "@material-ui/icons/Remove";

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
