import { connect } from "react-redux";
import { MessageLists } from "./Lists";

function ProjectMesages(props) {
  return (
    <MessageLists messages={props.projects[props.selectedProject].Messages} />
  );
}

const mapStateToProps = state => {
  return {
    projects: state.projects,
    selectedProject: state.selectedProject
  };
};

export default connect(mapStateToProps)(ProjectMesages);
