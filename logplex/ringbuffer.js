var EventEmitter = require('events').EventEmitter;
module.exports = RingBuffer;
 
RingBuffer.prototype = new EventEmitter();
function RingBuffer(capacity) {

  this.array = new Array(capacity);

  this.start = 0;
  this.end = -1;

  this.add = function(item) {
    
    var np = (this.end + 1) % capacity;

    this.array[np] = item;

    if(this.end != -1 && np === this.start) {
       this.start = (this.start +1) % capacity;
    }

    this.end = np;
    this.emit('added', item);
  };

  this.getAll = function() {
    if(this.end >= this.start) {
      return this.array.slice(this.start, this.end + 1);
    } else {
      var p1 = this.array.slice(this.start);
      var p2 = this.array.slice(0, this.start);
      return p1.concat(p2);
    }

  };
}

