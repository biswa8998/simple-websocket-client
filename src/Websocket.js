const WS = function(wsUri) {
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) {
    console.log("Connection Open", evt);
  };
  websocket.onclose = function(evt) {
    console.log("Connection Close", evt);
  };
  websocket.onmessage = function(evt) {
    console.log("Message Received", evt);
  };
  websocket.onerror = function(evt) {
    console.log("Error Occured", evt);
  };
};

export default WS;
