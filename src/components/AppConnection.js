import React, { useState } from "react";

import { Grid, Typography } from "@material-ui/core";
import AppStyles from "../Style";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

function AppConnection(props) {
  console.log(props);
  const classes = AppStyles();

  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState(false);

  function isValidUrl() {
    if (url.trim().length === 0) {
      setUrlError(true);
      return false;
    }

    return true;
  }

  return (
    <Grid className="app-request-wrapper">
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <TextField
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
            setUrl(props.urlValue);
            setUrlError(false);
          }}
        />
        <Button
          variant="contained"
          color="primary"
          classes={{ root: classes.buttonConnect }}
          onClick={() => {
            if (isValidUrl()) props.onClickConnect(url);
          }}
          disabled={url.length === 0}
        >
          CONNECT
        </Button>
      </Grid>
      <p className="save-this-request">
        <Button
          color="primary"
          variant="outlined"
          size="small"
          onClick={() => {
            if (isValidUrl()) props.onClickSave(url);
          }}
        >
          SAVE
        </Button>
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
