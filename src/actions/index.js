import * as Types from "../types/actionTypes";
import * as ModalTypes from "../types/modalTypes";
// import store from "../store";

/**
 * Modal Actions
 */
export const closeModal = () => {
  return {
    type: ModalTypes.CLOSE_MODAL,
    when: new Date().getTime()
  };
};

export const showCreateProjectModal = payload => {
  return {
    type: ModalTypes.SHOW_CREATE_PROJECT_MODAL,
    payload,
    when: new Date().getTime()
  };
};

export const showEditProjectModal = payload => {
  return {
    type: ModalTypes.SHOW_EDIT_PROJECT_MODAL,
    payload,
    when: new Date().getTime()
  };
};

export const showCreateRequestModal = payload => {
  return {
    type: ModalTypes.SHOW_CREATE_REQUEST_MODAL,
    payload,
    when: new Date().getTime()
  };
};

export const showEditRequestModal = payload => {
  return {
    type: ModalTypes.SHOW_EDIT_REQUEST_MODAL,
    payload,
    when: new Date().getTime()
  };
};

/**
 * Project Actions
 */
export const createProject = payload => {
  return dispatch => {
    dispatch({
      type: Types.CREATE_PROJECT,
      payload,
      when: new Date().getTime()
    });
    dispatch(closeModal());
  };
};

export const editProject = payload => {
  return dispatch => {
    dispatch({
      type: Types.EDIT_PROJECT,
      payload,
      when: new Date().getTime()
    });
    dispatch(closeModal());
  };
};

export const deleteProject = payload => {
  return {
    type: Types.DELETE_PROJECT,
    payload,
    when: new Date().getTime()
  };
};

export const changeProject = payload => {
  return {
    type: Types.CHANGE_PROJECT,
    payload,
    when: new Date().getTime()
  };
};

/**
 * Request Actions
 */
export const createRequest = payload => {
  return dispatch => {
    dispatch({
      type: Types.CREATE_REQUEST,
      payload,
      when: new Date().getTime()
    });
    dispatch(closeModal());
  };
};

export const editRequest = payload => {
  return {
    type: Types.EDIT_REQUEST,
    payload,
    when: new Date().getTime()
  };
};

export const deleteRequest = payload => {
  return {
    type: Types.DELETE_REQUEST,
    payload,
    when: new Date().getTime()
  };
};

export const changeRequest = payload => {
  return {
    type: Types.DELETE_REQUEST,
    payload,
    when: new Date().getTime()
  };
};

/**
 * Message Actions
 */

export const newMessage = payload => {
  return {
    type: Types.MESSAGE_NEW,
    when: new Date().getTime(),
    message: {
      type: payload.type,
      message: payload.message //"Connecting to URL" // payload.message
    },
    payload: {
      projectId: payload.projectId
    }
  };
};

/**
 * Websocket Actions
 */
export const createWebsocket = payload => {
  return dispatch => {
    dispatch(
      newMessage({
        type: Types.MESSAGE_SENT,
        message: "Connecting to URL",
        projectId: payload.selectedProject
      })
    );

    dispatch({
      type: Types.WS_CREATE,
      when: new Date().getTime(),
      payload
    });
  };
};

export const closeWebsocket = payload => {
  return dispatch => {
    dispatch(
      newMessage({
        type: Types.MESSAGE_SENT,
        message: "Disconnecting to URL",
        projectId: payload.projectId
      })
    );

    //
    //  Send close request for websocket
    //
    payload.project.Websocket.close();

    dispatch({
      type: Types.WS_CLOSE,
      when: new Date().getTime(),
      payload
    });
  };
};

export const onWsConnect = payload => {
  return dispatch => {
    dispatch(
      newMessage({
        type: Types.MESSAGE_RECEIVED,
        message: "Connected to URL",
        projectId: payload.projectId
      })
    );
    dispatch({
      type: Types.WS_CONNECTED,
      when: new Date().getTime(),
      payload
    });
  };
};

export const onWsDisconnect = payload => {
  return dispatch => {
    dispatch(
      newMessage({
        type: Types.MESSAGE_RECEIVED,
        message: "Disconnected from URL",
        projectId: payload.projectId
      })
    );
    dispatch({
      type: Types.WS_DISCONNECTED,
      when: new Date().getTime(),
      payload
    });
  };
};

export const sendMessageToWebsocket = payload => {
  return dispatch => {
    dispatch({
      type: Types.MESSAGE_NEW,
      when: new Date().getTime(),
      message: {
        type: Types.MESSAGE_SENT,
        message: payload.message
      },
      payload: {
        projectId: payload.projectId
      }
    });

    //
    //  Send close request for websocket
    //
    payload.project.Websocket.send(payload.message);
  };
};

export const onWsMessage = payload => {
  return dispatch => {
    dispatch({
      type: Types.MESSAGE_NEW,
      when: new Date().getTime(),
      message: {
        type: Types.MESSAGE_RECEIVED,
        message: payload.response.data
      },
      payload: {
        projectId: payload.projectId
      }
    });
  };
};

export const onWsError = payload => {
  return {
    type: Types.WS_ERROR,
    when: new Date().getTime(),
    payload
  };
};
