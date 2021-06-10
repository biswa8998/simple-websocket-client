import { EditModal } from "./CustomModals";
import * as ModalTypes from "../../types/modalTypes";
import * as Actions from "../../actions";
import { connect } from "react-redux";

function EditProjectModal(props) {
  const { activeUrl, projects, selectedProject } = props;
  const projectName = projects[selectedProject].Name;
  return (
    <EditModal
      open={props.currentOpenModal === ModalTypes.PROJECT_EDIT_MODAL}
      inputBoxOneValue={projectName}
      inputBoxTwoValue={activeUrl}
      title={`Edit Project`}
      description={``}
      inputBoxOneFocus={true}
      inputBoxTwoFocus={false}
      labelOne="Project Name"
      labelTwo="URL"
      multiline={false}
      multilineRows={0}
      isDisabled={false}
      leftButtonText="OK"
      leftButtonAction={props.editProject}
      rightButtonAction={props.closeModal}
    />
  );
}

const mapStateToProps = state => {
  return {
    currentOpenModal: state.currentOpenModal,
    projects: state.projects,
    selectedProject: state.selectedProject,
    activeUrl: state.activeUrl
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeModal: () => dispatch(Actions.closeModal()),
    editProject: data => dispatch(Actions.editProject(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProjectModal);
