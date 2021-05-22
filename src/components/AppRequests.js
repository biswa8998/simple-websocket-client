import React from "react";

import { Grid } from "@material-ui/core";

import AppColumnHeaders from "./AppColumnHeaders";

import { ButtonedLists } from "./Lists";

function AppRequests(props) {
  return (
    <Grid item lg={2} xs={12} className="app-columns">
      <div className="project-column-wrapper">
        <AppColumnHeaders title="Requests" />
        <div className="project-lister">
          <ButtonedLists
            Items={props.requests}
            onClick={props.onRequestClick}
            onClickEdit={props.onRequestEdit}
            onClickDelete={props.onRequestDelete}
            editAndDelete={true}
            selected={props.selectedRequestIndex}
          />
        </div>
      </div>
    </Grid>
  );
}

export default AppRequests;
