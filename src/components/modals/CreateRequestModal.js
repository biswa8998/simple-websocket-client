import { EditModal } from "./CustomModals";
import * as ModalTypes from "../../types/modalTypes";
import * as Actions from "../../actions";
import { connect } from "react-redux";

function CreateRequestModal(props) {
  const { activePayload } = props;
  return (
    <EditModal
      open={props.currentOpenModal === ModalTypes.REQUEST_CREATE_MODAL}
      inputBoxOneValue={""}
      inputBoxTwoValue={activePayload}
      title="Create Request"
      description="Create a new request"
      inputBoxOneFocus={true}
      inputBoxTwoFocus={false}
      labelOne="Request Name"
      labelTwo="Payload"
      multiline={true}
      multilineRows={4}
      isDisabled={false}
      leftButtonText="OK"
      leftButtonAction={props.createRequest}
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
    createRequest: data => dispatch(Actions.createRequest(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateRequestModal);
