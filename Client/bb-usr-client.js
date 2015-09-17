// To prepare the BeagleBone Black to run this, first run:
// sudo npm install -g signalr-client
// Then go to http://kichline-test.azurewebsites.net/ and enter BBB-USR as name when prompted.
// (If you are already on the site, just refresh the page.)
// Enter any number between 0 and 15 to light the 4 USR LEDs on the BeagleBoard in binary.

var b          = require('bonescript');
var signalR    = require('signalr-client');
var leds       = ["USR0", "USR1", "USR2", "USR3"];
var client     = new signalR.client("http://kichline-test.azurewebsites.net/signalR", ['ChatHub']);
var clientName = "bb1.kichline.com";
var initialMsg = "Node client up and running.";

for(var i in leds) {
    b.pinMode(leds[i], b.OUTPUT);
}

client.handlers.chathub = { 
    // method name must be all lower case
    // function signature should match call from hub
    broadcastmessage: function(name, message) {
        if (name == clientName && message == initialMsg) {
            console.log("Connection verified.");
        } else {
            console.log("revc => " + name + ": " + message);
            if("BBB-USR" == name) {
                processCommand(message);
            }
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

function processCommand(cmd) {
    var num = parseInt(cmd);
    for(var i = 0; i < 4; i++) {
        var v = Math.floor(num % 2);
        console.log("> setting pin", leds[i], "to", v);
        b.digitalWrite(leds[i], v);
        num /= 2;
    }
}

setTimeout(send, 1000);
