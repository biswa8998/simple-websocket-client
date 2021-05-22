import React from "react";

import { Grid } from "@material-ui/core";

import AppColumnHeaders from "./AppColumnHeaders";

import { ButtonedLists } from "./Lists";

function AppProjects(props) {
  return (
    <Grid item lg={2} xs={12} className="app-columns">
      <div className="project-column-wrapper">
        <AppColumnHeaders title="Projects" />
        <div className="project-lister">
          <ButtonedLists
            Items={props.projects}
            onClick={props.onProjectClick}
            onClickEdit={props.onProjectEdit}
            onClickDelete={props.onProjectDelete}
            editAndDelete={props.editAndDelete}
            selected={props.selectedProjectIndex}
          />
        </div>
      </div>
    </Grid>
  );
}

export default AppProjects;
