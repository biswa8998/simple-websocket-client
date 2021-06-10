import React from "react";
import { connect } from "react-redux";

import { Grid } from "@material-ui/core";

import AppColumnHeaders from "./AppColumnHeaders";

import { ButtonedLists } from "./Lists";

import * as ActionTypes from "../actions";

function AppProjects(props) {
  return (
    <Grid item lg={2} xs={12} className="app-columns">
      <div className="project-column-wrapper">
        <AppColumnHeaders title="Projects" />
        <div className="project-lister">
          <ButtonedLists
            Items={props.projects}
            onClick={props.changeProject}
            onClickEdit={props.showEditProjectModal}
            onClickDelete={props.onProjectDelete}
            editAndDelete={0 !== props.savedProjects}
            selected={props.selectedProject}
          />
        </div>
      </div>
    </Grid>
  );
}

const mapStateToProps = state => {
  const { projects, selectedProject, savedProjects } = state;
  return { projects, selectedProject, savedProjects };
};

const mapDispatchToProps = dispatch => {
  return {
    changeProject: data => dispatch(ActionTypes.changeProject(data)),
    showEditProjectModal: data =>
      dispatch(ActionTypes.showEditProjectModal(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppProjects);
