var union = require('union');
var director = require('director');
var RingBuffer = require('./ringbuffer');
var ringBuffers = require('./ringbuffers');
var CompositeRingBuffer = require('./session');
var uuid = require('node-uuid');

module.exports.createServer= function(options)  {
  return new LogplexWebServer(options);
};


function LogplexWebServer(options) {

  var self = this;

  self.start = function() {
    var router = new director.http.Router();
    self.webServer = union.createServer({
      before: [
        function (req, res) {
          var found = router.dispatch(req, res);
          if (!found) {
            res.emit('next');
          }
        }
      ]
    });
    setupRoutes(router);
    self.webServer.listen(options.port);
  };

  self.stop = function() {
    self.webServer.close();
  };

}


var sessions = [];

function setupRoutes(router) {

  router.post("/sessions", function () {
    var body = this.req.body;
    var id = uuid.v4();
    console.dir(body);
    var session = new CompositeRingBuffer(body);
    sessions[id] = session;
    this.res.write(JSON.stringify({ id: id }));
    this.res.end();
  });

  // TODO: handle no tail, length and ps/source filtering
  router.get("/sessions/:sessionId", { stream: true }, function (sessionId) {
    var req = this.req, res = this.res;

    var session = sessions[sessionId];

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    

    var snapshot = session.getAll();

    var formatItem = function(item) {
      var tsDate = new Date();
      tsDate.setTime(item.ts);
      return tsDate.toISOString() + ' ' + item.channel + '[' + item.source + ']: ' + item.msg;
    };
    
    snapshot.forEach(function(item) {
      if(item) res.write(formatItem(item));
    });

    var produce  = true;
    res.on('pause', function() {
      produce = false;
    });
    res.on('resume', function() {
      produce = true;
    });
    
    var writeAdded = function(item) {
      if(produce) {
        res.write(formatItem(item));
      }
    };

    res.response.socket.on('end', function() {
      produce = false;
      session.removeListener('added', writeAdded);
      console.log('Client disconnected');
    });

    session.on('added', writeAdded);
    res.on('close', function() {
      console.log('ended');
    });
    
    res.on('end', function() {
      console.log('ended');
    });
  });
}
