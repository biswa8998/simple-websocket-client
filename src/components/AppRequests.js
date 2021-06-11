import React from "react";
import { connect } from "react-redux";

import { Grid } from "@material-ui/core";

import AppColumnHeaders from "./AppColumnHeaders";

import { ButtonedLists } from "./Lists";

import * as ActionTypes from "../actions";

function AppRequests(props) {
  const { projects, selectedProject, selectedRequest } = props;

  return (
    <Grid item lg={2} xs={12} className="app-columns">
      <div className="project-column-wrapper">
        <AppColumnHeaders title="Requests" />
        <div className="project-lister">
          <ButtonedLists
            Items={projects[selectedProject].Requests}
            onClick={props.changeRequest}
            onClickEdit={props.showEditRequestModal}
            onClickDelete={props.onRequestDelete}
            editAndDelete={true}
            selected={projects[selectedProject].SelectedRequest}
          />
        </div>
      </div>
    </Grid>
  );
}

const mapStateToProps = state => {
  const { projects, selectedProject } = state;
  return { projects, selectedProject };
};

const mapDispatchToProps = dispatch => {
  return {
    changeRequest: data => dispatch(ActionTypes.changeRequest(data)),
    showEditRequestModal: data =>
      dispatch(ActionTypes.showEditRequestModal(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppRequests);
