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
    console.log('Logplex web server listening on port ' + options.port);
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
    console.log('POST /sessions', this.req.body);
    var body = this.req.body;
    var id = uuid.v4();
    var session = new CompositeRingBuffer(body);
    sessions[id] = session;
    this.res.write(JSON.stringify({ id: id }));
    this.res.end();
  });

  router.get("/sessions/:sessionId", { stream: true }, function (sessionId) {
    console.log('GET /sessions/' + sessionId);
    var req = this.req, res = this.res;
    var options = req.query;
    options.num = options.num || Number.MAX_VALUE;

    var session = sessions[sessionId];
    if(!session){
      res.writeHead(404);
      res.end();
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });


    var snapshot = session.getAll();

    var formatItem = function(item) {
      var tsDate = new Date();
      tsDate.setTime(item.ts);
      var str = tsDate.toISOString() + ' ' + item.channel + '[' + item.source + ']: ' + item.msg + '\n';
      return str;
    };

    var len = snapshot.length;
    snapshot.filter(function(item){
      if(options.ps){
        return options.ps === item.channel;
      }
      return true;
    }).filter(function(item){
      if(options.source){
        return options.source === item.source;
      }
      return true;
    }).forEach(function(item, i) {
      if(item && len - i <= options.num){
        res.write(formatItem(item));
      }
    });
    if(!options.tail){
      return res.end();
    }

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
