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

export default WS;
