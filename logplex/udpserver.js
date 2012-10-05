var udp = require('dgram');
var ringBuffers = require('./ringbuffers');
var RingBuffer = require('./ringbuffer');

module.exports.createServer = function(options) {
  return new LogplexUDPServer(options);
};

function LogplexUDPServer(options) {

  var self = this;

  self.start = function() {
    self.server = udp.createSocket('udp4');
    self.server.bind(options.port);
    self.server.on('message', function(raw,meta) {

      var msg = raw.toString();

      var ts = msg.substr(0,13);
      var token = msg.substr(14,36);
      var logmsg = msg.substring(51, msg.length -1); //remove trailing \n

      var rb = ringBuffers[token];
      if(!rb) {
        console.log('creating ringbuffer for ' + token);
        ringBuffers[token] = new RingBuffer(500);
        rb = ringBuffers[token];
      }

      var entry = {
        ts: +(ts),
        token: token,
        msg: logmsg
      };

      rb.add(entry);
    });
  };

  self.stop = function() {
    self.server.close();
  };
}


