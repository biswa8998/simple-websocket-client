import React, { useState, useEffect } from "react";
import AppStyles from "../Style";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import {
  DeleteButtonIcon,
  EditButtonIcon,
  CopyButton,
  JsonBeautyButton
} from "./Buttons";
import * as ActionTypes from "../types/actionTypes";

import { copyToClipboard } from "../Util";

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
                e.stopPropagation();
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
  const [beautifiedIds, setBeautifiedIds] = useState([]);
  const [msgLength, setMesLength] = useState(0);

  useEffect(() => {
    setMesLength(msgLength);
    // eslint-disable-next-line
  }, [props.messages.length]);

  function beautify(msgId, alreadyBeautified) {
    let newArr = [];
    let newBeautifiedIds = [];
    if (!alreadyBeautified) {
      newBeautifiedIds = [...beautifiedIds];
      newBeautifiedIds.push(msgId);
    } else {
      newBeautifiedIds = [...beautifiedIds];
      newBeautifiedIds.splice(newArr.indexOf(msgId), 1);
    }

    // setMessagesArr(newArr);
    setBeautifiedIds(newBeautifiedIds);
  }

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
        props.messages.map((m, msgIndex) => {
          let rootStyle, messageHeaderStyle;

          if (m.type === ActionTypes.MESSAGE_SENT) {
            rootStyle = classes.sentMessage;
            messageHeaderStyle = "sentMessageHeader";
          }
          if (m.type === ActionTypes.MESSAGE_RECEIVED) {
            rootStyle = classes.receivedMessage;
            messageHeaderStyle = "receivedMessageHeader";
          }

          let isJson = false;
          try {
            JSON.parse(m.message);
            isJson = true;
          } catch (ex) {}

          let msg = m.message;
          let beautified = false;
          if (beautifiedIds.indexOf(m.id) !== -1) {
            msg = JSON.stringify(JSON.parse(m.message), undefined, 4);
            beautified = true;
          }

          let MSG = null;

          if (msg.indexOf("\n") === -1) {
            MSG = (
              <div>
                <pre>{msg}</pre>
              </div>
            );
          } else {
            MSG = msg.split("\n").map((e, j) => {
              return (
                <div key={`m${j}`}>
                  <pre>{e}</pre>
                </div>
              );
            });
          }

          return (
            <ListItem classes={{ root: rootStyle }} key={m.id}>
              <ListItemText
                disableTypography={true}
                classes={{ root: classes.messageFontSize }}
              >
                <div className={messageHeaderStyle}>
                  {m.time}

                  <CopyButton
                    onClick={() => {
                      copyToClipboard(`message-${m.id}`, msg);
                    }}
                  />
                  {isJson && (
                    <JsonBeautyButton
                      onClick={() => {
                        beautify(m.id, beautified);
                      }}
                    />
                  )}
                </div>
                <div id={`message-${m.id}`} className="message-text-wrapper">
                  {MSG}
                </div>
              </ListItemText>
            </ListItem>
          );
        })
      )}
    </List>
  );
}
