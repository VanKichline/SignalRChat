var signalR = require('signalr-client');

var client  = new signalR.client("http://kichline-test.azurewebsites.net/signalR", ['ChatHub']);
var clientName = "IoT eLinux Device";
var initialMsg = "Node client up and running";

client.handlers.chathub = { 
    // method name must be all lower case
    // function signature should match call from hub
    broadcastmessage: function(name, message) {
        if (name == clientName && message == initialMsg) {
            console.log("Connection verified.");
        } else {
            console.log("revc => " + name + ": " + message);
        }
    }
};

function send() {
    console.log("Sending initial message");
    client.invoke(
        'ChatHub', // Hub Name (case insensitive)
        'Send',	// Method Name (case insensitive)
        clientName, initialMsg //additional parameters to match called signature
        );
}

setTimeout(send, 1000);


// client.serviceHandlers = {
//     bound: function() { console.log("Websocket bound"); },
//     connectFailed: function(error) { console.log("Websocket connectFailed: ", error); },
//     connected: function(connection) { console.log("Websocket connected"); },
//     disconnected: function() { console.log("Websocket disconnected"); },
//     onerror: function (error) { console.log("Websocket onerror: ", error); },
//     messageReceived: function (message) { console.log("Websocket messageReceived: ", message); return false; },
//     bindingError: function (error) { console.log("Websocket bindingError: ", error); },
//     connectionLost: function (error) { console.log("Connection Lost: ", error); },
//     reconnecting: function (retry /* { inital: true/false, count: 0} */) {
//         console.log("Websocket Retrying: ", retry);
//         //return retry.count >= 3; /* cancel retry true */
//         return true; 
//     }
// };
