import { EditModal } from "./CustomModals";
import * as ModalTypes from "../../types/modalTypes";
import * as Actions from "../../actions";
import { connect } from "react-redux";

function EditRequestModal(props) {
  const { activePayload, projects, selectedProject } = props;
  const requestName =
    projects[selectedProject].Requests[
      projects[selectedProject].SelectedRequest
    ].Name;
  return (
    <EditModal
      open={props.currentOpenModal === ModalTypes.REQUEST_EDIT_MODAL}
      inputBoxOneValue={requestName}
      inputBoxTwoValue={activePayload}
      title={`Edit Request`}
      description={``}
      inputBoxOneFocus={true}
      inputBoxTwoFocus={false}
      labelOne="Request Name"
      labelTwo="Payload"
      multiline={true}
      multilineRows={4}
      isDisabled={false}
      leftButtonText="OK"
      leftButtonAction={props.editRequest}
      rightButtonAction={props.closeModal}
    />
  );
}

const mapStateToProps = state => {
  return {
    currentOpenModal: state.currentOpenModal,
    projects: state.projects,
    selectedProject: state.selectedProject,
    activePayload: state.activePayload
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeModal: () => dispatch(Actions.closeModal()),
    editRequest: data => dispatch(Actions.editRequest(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditRequestModal);
