import { EditModal } from "./CustomModals";
import * as ModalTypes from "../../types/modalTypes";
import * as Actions from "../../actions";
import { connect } from "react-redux";

function CreateProjectModal(props) {
  const { activeUrl } = props;
  return (
    <EditModal
      open={props.currentOpenModal === ModalTypes.PROJECT_CREATE_MODAL}
      inputBoxOneValue={""}
      inputBoxTwoValue={activeUrl}
      title="Create Project"
      description="Create a new project"
      inputBoxOneFocus={true}
      inputBoxTwoFocus={false}
      labelOne="Project Name"
      labelTwo="URL"
      multiline={false}
      multilineRows={0}
      isDisabled={false}
      leftButtonText="OK"
      leftButtonAction={props.createProject}
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
    createProject: data => dispatch(Actions.createProject(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProjectModal);
