import React, { useState } from "react";
import AppStyles from "../Style";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";

import { DeleteButtonIcon, EditButtonIcon } from "./Buttons";

function Item(props) {
  const classes = AppStyles();
  const [itemValue, setItemValue] = useState("");
  const [editMode, setEditMode] = useState(false);

  // if (itemValue !== props.itemValue) {
  //   setItemValue(props.itemValue);
  // }

  function onTextChange(e) {
    setItemValue(e.target.value);

    if (
      e.type === "blur" ||
      (e.type === "keypress" && e.key.toLowerCase() === "enter")
    ) {
      props.onEdit(itemValue);
      setEditMode(false);
    }
  }

  return (
    <React.Fragment>
      <ListItem
        button
        classes={{
          gutters: classes.listItems
        }}
        onClick={() => {
          props.onClick(props.id);
        }}
      >
        {editMode ? (
          <TextField
            variant="standard"
            type="text"
            fullWidth={true}
            value={itemValue}
            autoFocus
            onChange={onTextChange}
            onBlur={onTextChange}
            onKeyPress={onTextChange}
          />
        ) : (
          <>
            <ListItemText
              primary={props.itemValue}
              classes={{
                primary: classes.listEllipsisText
              }}
              title={itemValue}
            />
            {props.editAndDelete && (
              <EditButtonIcon
                buttonTitle={itemValue}
                onClick={() => {
                  setItemValue(props.itemValue);
                  setEditMode(true);
                }}
              />
            )}
            {props.editAndDelete && (
              <DeleteButtonIcon
                buttonTitle={itemValue}
                onClick={e => {
                  props.onDelete(props.id);
                  e.stopPropagation();
                }}
              />
            )}
          </>
        )}
      </ListItem>
    </React.Fragment>
  );
}

function Lists(props) {
  const classes = AppStyles();
  const nItems = props.Items.length;

  return props.Items.length > 0 ? (
    <List className={classes.list} aria-label="projects">
      {props.Items.map((e, i) => {
        return (
          <React.Fragment key={i}>
            <Item
              onClick={props.onClick}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
              itemValue={e.Name}
              id={i}
              editAndDelete={props.editAndDelete}
            />
            {nItems - 1 === i ? null : <Divider light />}
          </React.Fragment>
        );
      })}
    </List>
  ) : null;
}

export default Lists;
