function WS(wsUri) {
  const websocket = new WebSocket(wsUri);

  // websocket.onopen = function(evt) {
  //   console.log("Connection Open", evt);
  // };
  // websocket.onclose = function(evt) {
  //   console.log("Connection Close", evt);
  // };
  // websocket.onmessage = function(evt) {
  //   console.log("Message Received", evt);
  // };
  // websocket.onerror = function(evt) {
  //   console.log("Error Occured", evt);
  // };

  //////////////////////////////

  this.addOnOpen = function(callback) {
    websocket.onopen = function(event) {
      console.log("Connection Open", event);
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
      console.log(event);
      callback(event);
    };
  };

  this.addOnError = callback => {
    websocket.onerror = function(event) {
      callback(event);
    };
  };

  this.send = message => {
    console.log(message);
    websocket.send(message);
  };

  this.close = () => {
    websocket.close();
  };
}

export default WS;
