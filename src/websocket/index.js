import * as Actions from "../actions";
import store from "../store";
import * as Types from "../types/actionTypes";

function WS(wsUri) {
  const websocket = new WebSocket(wsUri);

  this.addOnOpen = function(callback) {
    websocket.onopen = function(event) {
      callback(event);
    };
  };

  this.addOnClose = function(callback) {
    websocket.onclose = function(event) {
      callback(event);
    };
  };

  this.addOnMessage = callback => {
    websocket.onmessage = function(event) {
      callback(event);
    };
  };

  this.addOnError = callback => {
    websocket.onerror = function(event) {
      callback(event);
    };
  };

  this.send = message => {
    websocket.send(message);
  };

  this.close = () => {
    websocket.close();
  };
}

export default function createSocket(url, projectId) {
  const ws = new WS(url);
  ws.addOnOpen(response => {
    store.dispatch(
      Actions.onWsConnect({
        response,
        projectId
      })
    );
  });

  ws.addOnClose(response => {
    store.dispatch(
      Actions.onWsDisconnect({
        response,
        projectId
      })
    );
  });
  ws.addOnMessage(response => {
    store.dispatch(
      Actions.onWsMessage({
        response,
        projectId
      })
    );
  });
  ws.addOnError(response => {
    store.dispatch({
      type: Types.WS_ERROR,
      payload: {
        projectId,
        response
      }
    });
  });

  return ws;
}
