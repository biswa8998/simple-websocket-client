// import { combineReducers } from "redux";
import * as Types from "../types/actionTypes";
import createSocket from "../websocket/index";
import * as ModalTypes from "../types/modalTypes";
import { getTime } from "../Util";
export const initialState = {
  projects: [
    {
      Name: "Untitled",
      Requests: [],
      Url: "wss://echo.websocket.org",
      Messages: [],
      Websocket: null,
      ConnectionState: Types.DISCONNECTED
    }
  ],
  lastAction: "",
  lastActionTime: "",
  selectedProject: 0,
  selectedRequest: null,
  savedProjects: 0,
  currentOpenModal: null,
  operationMode: "",
  activeUrl: "",
  activePayload: ""
};

function appReducer(state = initialState, action) {
  let newState = { ...state };
  newState.lastAction = action.type;
  newState.lastActionTime = action.when;
  let projects = [...newState.projects];
  let messages = null;
  switch (action.type) {
    /**********************************************************
     * ********************************************************
     *                WebSocket Reducers                      *
     * ********************************************************
     *********************************************************/
    case Types.WS_CREATE:
      projects[action.payload.selectedProject].Url = action.payload.url;
      projects[action.payload.selectedProject].ConnectionState =
        Types.CONNECTING;
      projects[action.payload.selectedProject].Websocket = createSocket(
        action.payload.url,
        action.payload.selectedProject
      );
      newState.projects = [...projects];
      return newState;

    case Types.WS_CONNECTED:
      projects[action.payload.projectId].ConnectionState = Types.CONNECTED;
      newState.projects = [...projects];
      return newState;

    case Types.WS_CLOSE:
      projects[action.payload.projectId].ConnectionState = Types.DISCONNECTING;
      newState.projects = [...projects];
      return newState;

    case Types.WS_DISCONNECTED:
      projects[action.payload.projectId].ConnectionState = Types.DISCONNECTED;
      newState.projects = [...projects];
      return newState;
    case Types.WS_MESSAGE_RECEIVED:
      return newState;
    /**********************************************************
     * ********************************************************
     *                Modals Reducers                         *
     * ********************************************************
     *********************************************************/
    case ModalTypes.CLOSE_MODAL:
      newState.currentOpenModal = null;
      return newState;

    case ModalTypes.SHOW_CREATE_PROJECT_MODAL:
      newState.currentOpenModal = ModalTypes.PROJECT_CREATE_MODAL;
      newState.activeUrl = action.payload.url;
      return newState;

    case ModalTypes.SHOW_EDIT_PROJECT_MODAL:
      newState.currentOpenModal = ModalTypes.PROJECT_EDIT_MODAL;
      newState.selectedProject = action.payload;
      return newState;

    case ModalTypes.SHOW_CREATE_REQUEST_MODAL:
      newState.currentOpenModal = ModalTypes.REQUEST_CREATE_MODAL;
      newState.activePayload = action.payload.payload;
      return newState;
    /**********************************************************
     * ********************************************************
     *                Project Reducers                        *
     * ********************************************************
     *********************************************************/
    case Types.CHANGE_PROJECT:
      newState.selectedProject = action.payload;
      return newState;

    case Types.CREATE_PROJECT:
      if (newState.savedProjects === 0) {
        projects[newState.selectedProject].Name = action.payload.projectName;
        projects[newState.selectedProject].Url = action.payload.projectUrl;
      } else {
        const newProject = {};
        newProject.Name = action.payload.projectName;
        newProject.Url = action.payload.projectUrl;
        newProject.Requests = [];
        newProject.Messages = [];
        newProject.ConnectionState = Types.DISCONNECTED;
        newProject.Websocket = null;
        projects = [...projects, newProject];
      }
      newState.savedProjects += 1;
      newState.projects = projects;
      return newState;

    case Types.EDIT_PROJECT:
      projects[newState.selectedProject].Name = action.payload.projectName;
      projects[newState.selectedProject].Url = action.payload.projectUrl;
      newState.projects = projects;
      return newState;

    /**********************************************************
     * ********************************************************
     *                Request Reducers                        *
     * ********************************************************
     *********************************************************/

    case Types.CREATE_REQUEST:
      return newState;

    /**********************************************************
     * ********************************************************
     *                Message Reducers                        *
     * ********************************************************
     *********************************************************/
    case Types.MESSAGE_NEW:
      messages = [...projects[action.payload.projectId].Messages];
      messages.splice(0, 0, {
        type: action.message.type,
        message: action.message.message,
        time: getTime(),
        id: new Date().getTime() + Math.random() * 10000
      });
      projects[action.payload.projectId].Messages = messages;
      newState.projects = projects;
      return newState;

    default:
      return state;
  }
}

export default appReducer;
