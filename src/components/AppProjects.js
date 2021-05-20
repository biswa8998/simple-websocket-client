import React from "react";

import { Grid } from "@material-ui/core";

import AppColumnHeaders from "./AppColumnHeaders";

import Lists from "./Lists";

function AppProjects(props) {
  return (
    <Grid item lg={2} xs={12} className="app-columns">
      <div className="project-column-wrapper">
        <AppColumnHeaders title="Projects" />
        <div className="project-lister">
          <Lists
            Items={props.projects}
            onClick={props.onProjectClick}
            onEdit={props.onProjectEdit}
            onDelete={props.onProjectDelete}
            editAndDelete={props.editAndDelete}
          />
        </div>
      </div>
    </Grid>
  );
}

export default AppProjects;
