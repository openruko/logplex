var RingBuffer = require('../ringbuffer');
var assert = require('assert');

describe('ring buffer', function() {

  it('empty element', function() {

    var rb = new RingBuffer(5);
    assert.deepEqual([], rb.getAll());

  });

  it('one element', function() {

    var rb = new RingBuffer(5);

    rb.add(1);

    var result = rb.getAll();

    assert.deepEqual([1],result);
  });
  
  it('two elements', function() {

    var rb = new RingBuffer(5);

    rb.add(1);
    rb.add(2);

    var result = rb.getAll();

    assert.deepEqual([1,2],result);
  });

  it('three elements', function() {

    var rb = new RingBuffer(5);

    rb.add(1);
    rb.add(2);
    rb.add(3);

    var result = rb.getAll();

    assert.deepEqual([1,2,3],result);
  });

  it('five elements', function() {

    var rb = new RingBuffer(5);

    rb.add(1);
    rb.add(2);
    rb.add(3);
    rb.add(4);
    rb.add(5);

    var result = rb.getAll();

    assert.deepEqual([1,2,3,4,5],result);
  });

  it('six elements', function() {

    var rb = new RingBuffer(5);

    rb.add(1);
    rb.add(2);
    rb.add(3);
    rb.add(4);
    rb.add(5);
    rb.add(6);

    var result = rb.getAll();

    assert.deepEqual([2,3,4,5,6],result);
  });

  it('eight elements', function() {

    var rb = new RingBuffer(5);

    rb.add(1);
    rb.add(2);
    rb.add(3);
    rb.add(4);
    rb.add(5);
    rb.add(6);
    rb.add(7);
    rb.add(8);

    var result = rb.getAll();

    assert.deepEqual([4,5,6,7,8],result);
  });

  it('2333 elements', function() {

    var rb = new RingBuffer(5);

    for(var i=0;i<2333;i++) {
      rb.add(i+1);
    }

    var result = rb.getAll();

    assert.deepEqual([2329,2330,2331,2332,2333],result);
  });
});
