import React, { useState, useEffect } from "react";

import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

function AppPayload(props) {
  const [payload, setPayload] = useState(props.payload);

  useEffect(() => {
    setPayload(props.payload);
  }, [props.payload]);

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="flex-start"
      className="app-payload-wrapper"
      id="app-payload-wrapper"
    >
      <Grid container className="input-request-payload">
        <TextField
          id="outlined-multiline-static"
          label="Payload"
          multiline
          rows={4}
          variant="outlined"
          fullWidth={true}
          value={payload}
          spellCheck="false"
          onChange={e => {
            setPayload(e.target.value);
          }}
        />
        <p className="save-this-request">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              props.onClickSend(payload);
            }}
            disabled={!props.connected || payload.trim().length === 0}
          >
            SEND
          </Button>
        </p>
      </Grid>
    </Grid>
  );
}

export default AppPayload;
