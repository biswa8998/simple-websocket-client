import React from "react";

import { Grid } from "@material-ui/core";

import AppColumnHeaders from "./AppColumnHeaders";

import Lists from "./Lists";

function AppRequests(props) {
  return (
    <Grid item lg={2} xs={12} className="app-columns">
      <div className="project-column-wrapper">
        <AppColumnHeaders title="Requests" />
        <div className="project-lister">
          <Lists
            Items={props.requests}
            onClick={props.onRequestClick}
            onEdit={props.onRequestEdit}
            onDelete={props.onRequestDelete}
            editAndDelete={true}
          />
        </div>
      </div>
    </Grid>
  );
}

export default AppRequests;
