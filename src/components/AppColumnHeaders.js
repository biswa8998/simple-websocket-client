import React from "react";

function AppColumnHeaders(props) {
  return (
    <div className="project-column-header">
      <div className="project-column-title">
        {props.title}
        {/* <RemoveButtonIcon /> */}
      </div>
    </div>
  );
}

export default AppColumnHeaders;
