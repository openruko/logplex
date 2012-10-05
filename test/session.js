var udpServer = require('../udpserver');
var Session = require('../session');
var uuid = require('node-uuid');

var PORT = 9999;
var WEBPORT = 9001;

describe('playback session', function() {


  it('should aggregate different token ids', function(cb) {

    var server = udpServer.createServer({ port: PORT });
    server.start();
    
    var tokens = [];

    tokens.push({
      id: uuid.v4(),
      source: 'heroku',
      ps: 'router'
    });

    tokens.push({
      id: uuid.v4(),
      source: 'app',
      ps: 'web.1'
    });

    tokens.push({
      id: uuid.v4(),
      source: 'app',
      ps: 'worker.1'
    });

    var payload = {
      tokens: tokens
    };

    var udpClient = require('dgram').createSocket('udp4');
    sendMessage(udpClient, tokens[0].id, "testing router");
    sendMessage(udpClient, tokens[1].id, "testing app web.1");
    sendMessage(udpClient, tokens[2].id, "testing app worker.1");

    setTimeout(function() {
      var session = new Session(payload);
      var snapshot = session.getAll();
      console.dir(snapshot)
    }, 200);

  });

});

function sendMessage(client, tokenId, msg) {
  var ts = +(new Date());
  var buffer = new Buffer(ts.toString() + ' ' + tokenId + ' ' +  msg);
  client.send(buffer, 0, buffer.length, PORT, 'localhost');
}
