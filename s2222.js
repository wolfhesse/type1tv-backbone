var ticker_interval;
var io = require('socket.io')();
var last_s;
var port = process.env.port || 2222;
io.listen(port);

// io.configure(function(){
	// io.set("transports", ["xhr-polling"]);
	// io.set("polling duration", 10);
	// io.set("close timeout", 10);
	// io.set("loglevel", 1);
// });

io.sockets.on('connection', function (socket) {
	last_s = socket;
	if (null == ticker_interval) {
		ticker_interval = setInterval(function () {
			io.emit('tick', new Date);
			// last client gets sync-start
			last_s.emit('event', {'srv:last_s:tick' : new Date});
			console.log('server: tick');
		},
		1000);
	}
	socket.on('helo', function (data) {
		console.log('socket.helo: pre parse');
		var vals = JSON.stringify(data);
		console.log('server: helo data ' + vals);
		io.emit('data', {'srv:clt:data' : data});
	});
	socket.on('disconnect', function (socket) {
		io.emit('event', 'another client disconnected');
		console.log('server: disconnect');
	});
});

setInterval(function () {
	console.log('server: ticker_interval @ ' + new Date);
}, 5000);

