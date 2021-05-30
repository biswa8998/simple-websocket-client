import React, { useState, useEffect } from "react";

import { Grid, Typography } from "@material-ui/core";
import AppStyles from "../Style";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

function AppConnection(props) {
  const classes = AppStyles();

  const [url, setUrl] = useState(props.urlValue);
  useEffect(() => {
    setUrl(props.urlValue);
  }, [props.urlValue]);

  const [urlError, setUrlError] = useState(false);

  function isValidUrl() {
    if (url.trim().length === 0) {
      setUrlError(true);
      return false;
    }

    return true;
  }

  return (
    <Grid id="app-request-wrapper" className="app-request-wrapper">
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <TextField
          autoFocus
          id="outlined-basic"
          label="Websocket URL"
          variant="outlined"
          type="text"
          fullWidth={true}
          value={url}
          error={urlError}
          onChange={e => {
            setUrl(e.target.value);
          }}
          onClick={() => {
            setUrlError(false);
          }}
        />
        <Button
          variant="contained"
          color={props.connected ? "secondary" : "primary"}
          classes={{ root: classes.buttonConnect }}
          onClick={() => {
            if (isValidUrl()) props.onClickConnect(url);
          }}
          disabled={url.length === 0}
        >
          {props.connected ? "DISCONNECT" : "CONNECT"}
        </Button>
      </Grid>
      <p className="save-this-request">
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={() => {
            if (isValidUrl()) props.saveNewProject(url);
          }}
        >
          NEW PROJECT
        </Button>
        {/* <Button
          color="primary"
          variant="outlined"
          size="small"
          onClick={() => {
            if (isValidUrl()) props.saveNewProject(url);
          }}
          style={{ marginLeft: "20px" }}
        >
          UPDATE
        </Button> */}
        {false ? (
          <Typography
            variant="caption"
            color="error"
            classes={{ root: classes.urlErrorText }}
          >
            This is some text
          </Typography>
        ) : null}
      </p>
    </Grid>
  );
}

export default AppConnection;
