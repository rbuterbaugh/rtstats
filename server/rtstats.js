String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g,"");
};

var http = require('http'), net = require('net'), io = require('socket.io');
var httpServer = http.createServer(function(req, res) { });
httpServer.listen(8080);
var ioSocket = io.listen(httpServer); 

var buffer="";
var tcpServer =
  net.createServer(
    function (socket) {
      socket.on('data',function(data) {
		  buffer+=data.toString();
		  processBuffer();
		}
	       );
    }
  )
  .listen(8081);

function formatAndSend(line) {
  var regexp=/^([0-9\.]+) [^\s]+ [^\s]+ \[([a-zA-Z0-9\/]+):([0-9:]+) ([0-9-]+)\] \"([A-Z]+) ([^\"]+) HTTP\/[0-9\.]+\" ([0-9-]+) ([0-9-]+) \"([^\"]+)\" \"([^\"]+)\"$/;
  var matches=regexp.exec(line.trim());
  var matchObj= {
    ip: matches[1],
    date: matches[2],
    time: matches[3],
    tz: matches[4],
    method: matches[5],
    url: matches[6],
    status: matches[7],
    size: matches[8],
    referer: matches[9],
    useragent: matches[10]
  };
  ioSocket.broadcast(JSON.stringify(matchObj));
}

function processBuffer() {
  var firstNewline=buffer.indexOf("\n");
  while (firstNewline > -1) {
    formatAndSend(buffer.substr(0,firstNewline));
    buffer=buffer.substr(firstNewline+1);
    firstNewline=buffer.indexOf("\n");
  }
}