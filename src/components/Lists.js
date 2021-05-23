import React, { useState, useEffect } from "react";
import AppStyles from "../Style";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import { DeleteButtonIcon, EditButtonIcon } from "./Buttons";
import Types from "../dataType";

function Item(props) {
  const classes = AppStyles();

  return (
    <React.Fragment>
      <ListItem
        selected={props.selected}
        button
        classes={{
          gutters: classes.listItems
        }}
        onClick={() => {
          props.onClick(props.id);
        }}
        title={props.itemValue}
      >
        <>
          <ListItemText
            primary={props.itemValue}
            classes={{
              primary: classes.listEllipsisText
            }}
          />
          {props.editAndDelete && (
            <EditButtonIcon
              buttonTitle={props.itemValue}
              onClick={e => {
                props.onClickEdit(props.id);
              }}
            />
          )}
          {props.editAndDelete && (
            <DeleteButtonIcon
              buttonTitle={props.itemValue}
              onClick={e => {
                props.onClickDelete(props.id);
                e.stopPropagation();
              }}
            />
          )}
        </>
      </ListItem>
    </React.Fragment>
  );
}

export function ButtonedLists(props) {
  const classes = AppStyles();
  const nItems = props.Items.length;

  const [selected, setSelected] = useState(props.selected);

  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  return props.Items.length > 0 ? (
    <List className={classes.list} aria-label="projects">
      {props.Items.map((e, i) => {
        return (
          <React.Fragment key={i}>
            <Item
              selected={selected === i}
              onClick={() => {
                setSelected(i);
                props.onClick(i);
              }}
              onClickEdit={props.onClickEdit}
              onClickDelete={props.onClickDelete}
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

export function MessageLists(props) {
  const classes = AppStyles();
  return (
    <List
      className={classes.list}
      aria-label="messages"
      classes={{ root: classes.messageItem }}
    >
      {props.messages.length === 0 ? (
        <ListItem>
          <ListItemText>Messages will be logged here</ListItemText>
        </ListItem>
      ) : (
        props.messages.map((m, i) => {
          let rootStyle, messageHeaderStyle;
          if (m.type === Types.SENT_MESSAGE) {
            rootStyle = classes.sentMessage;
            messageHeaderStyle = "sentMessageHeader";
          }
          if (m.type === Types.RECEIVED_MESSAGE) {
            rootStyle = classes.receivedMessage;
            messageHeaderStyle = "receivedMessageHeader";
          }

          return (
            <ListItem classes={{ root: rootStyle }} key={i}>
              <ListItemText
                disableTypography={true}
                classes={{ root: classes.messageFontSize }}
              >
                <div className={messageHeaderStyle}>{m.time}</div>
                <div>
                  {m.message.split("\n").map((e, i) => {
                    return <div key={`m${i}`}>{e}</div>;
                  })}
                </div>
              </ListItemText>
            </ListItem>
          );
        })
      )}
      {/* <ListItem classes={{ root: classes.receivedMessage }}>
        <ListItemText
          disableTypography={true}
          classes={{ root: classes.messageFontSize }}
        >
          <div className="receivedMessageHeader">21-March-2021 20:20:20</div>
          <div>
            <div>asdasdasdasd</div>
            <div>asdasdasdasd</div>
            <div>asdasdasdasd</div>
            <div>asdasdasdasd</div>
          </div>
        </ListItemText>
      </ListItem>
      <ListItem classes={{ root: classes.sentMessage }}>
        <ListItemText
          disableTypography={true}
          classes={{ root: classes.messageFontSize }}
        >
          <div className="sentMessageHeader">21-March-2021 20:20:20</div>
          <div>asdasdasdasd</div>
          <div>asdasdasdasd</div>
          <div>asdasdasdasd</div>
          <div>asdasdasdasd</div>
        </ListItemText>
      </ListItem> */}
    </List>
  );
}
