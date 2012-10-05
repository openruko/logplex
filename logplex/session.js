var EventEmitter = require('events').EventEmitter;
var ringBuffers = require('./ringbuffers');
var RingBuffer = require('./ringbuffer');

module.exports = CompositeRingBuffer;

function CompositeRingBuffer(options) {

  var self = this;
  var rbs = options.tokens.map(function(token) {
    if(!ringBuffers[token.id]) {
      ringBuffers[token.id] = new RingBuffer(500);
    }
    var rb = ringBuffers[token.id];
    rb.channel = token.channel;
    rb.source = token.source;
    return rb;
  });

  self.getAll = function() {

    var output = [];

    rbs.forEach(function(rb) {
      var all = rb.getAll();
      console.dir(all)
      all.forEach(function(item) {
        if(item) {
          item.channel = rb.channel;
          item.source = rb.source;
        }
      });
      output = output.concat(all); // inefficient use push?
    });
    output.sort(function(entry1, entry2) {
      console.log(entry1.ts)
      console.log(entry2.ts)
      return entry1.ts > entry2.ts ? 1 : -1;
    });
    return output;
  };
  
  rbs.forEach(function(rb) {
    rb.on('added', function(item) {
      var contextedItem = {
        ts: item.ts,
        msg: item.msg,
        token: item.token,
        channel: rb.channel,
        source: rb.source
      };
      self.emit('added',contextedItem);
    });
  });
}


CompositeRingBuffer.prototype = new EventEmitter();
