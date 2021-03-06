var express = require('express'),
		app = express(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server),
		nicknames = [];

app.use(express.static(__dirname + '/public'));

server.listen(3000, function(){
	console.log('2014 Tari project');
	console.log('Chat server is listening for incoming data');
});


//Per qualsiasi richiesta sulla route, la nostra risposta sarà fornire il file index.html
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});


io.sockets.on('connection', function(socket) {
	
	socket.on('new user', function(data, callback){
		if (nicknames.indexOf(data) != -1){
			socket.broadcast.emit("New user online");
			callback(false);
		} else {
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			updateNicknames();
		}
	});
	
	function updateNicknames(){
		io.sockets.emit('usernames', nicknames);
	}
	
	socket.on('send message', function(data){
		console.log(socket.nickname + ' : ' + data);
		io.sockets.emit('new message', {msg : data, nick: socket.nickname});
	});
	
	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
	});

});