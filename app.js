var express = require("express");
var app = express();
//const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var path = require("path");
var favicon = require("static-favicon");
//var logger = require("morgan");
//var cookieParser = require("cookie-parser");
//var bodyParser = require("body-parser");

var room_id = 1;
var user_id = 1;
var parent_user_id = 1;

const PORT = process.env.PORT || 3000;

app.get(`/test`, (req, res) => {
  res.sendFile(__dirname + '/test.html');
});
app.get(`/movie`, (req, res) => {
  res.sendFile(__dirname + '/movie.html');
});
app.get(`/movie2`, (req, res) => {
  res.sendFile(__dirname + '/movie2.html');
});
app.get(`/`, (req, res) => {
  res.sendFile(__dirname + '/top.html');
});
app.use(express.static(path.join(__dirname, "public")));


user2socket_array = []

io.on('connection', (socket) => {

	socket.on('init', (user_id) => {
		console.log('init');
		console.log(user_id);
		console.log('a user connected' + socket.id);
		user2socket_array.push({ user_id: user_id, socket_id: socket.id });
		console.log(user2socket_array);
		io.emit('chat message', user_id + "さんが入室しました.(現在:" + user2socket_array.length  + "人/親:" + user2socket_array[0].user_id + ")");
		//io.emit('chat message', "現在の人数は" + user2socket_array.length + "人です.");		
		//io.emit('chat message', "親は" + user2socket_array[0].user_id + "です");
	});

	socket.on('chat message', (msg) => {
		io.emit('chat message', msg);
	});

	socket.on('timeline_message', (player_time) => {
		console.log(player_time);
		for (var i = 0; i < user2socket_array.length; i++) {
			if(user2socket_array[0].socket_id == socket.id){
				console.log("親の再生位置:" + player_time);
				io.json.emit('parent_timeline_message', {
					parent_user_id:user2socket_array[0].user_id,
					time:player_time
				});
			}
		}
	});

	socket.on('disconnect', () => {
		console.log('disconnect' + socket.id);
		for (var i = 0; i < user2socket_array.length; i++) {
			if(user2socket_array[i].socket_id == socket.id){
				io.emit('chat message', user_id + "さんが退室しました.(現在:" + user2socket_array.length  + "人/親:" + user2socket_array[0].user_id + ")");
				//io.emit('chat message', user2socket_array[i].user_id + "さんが退室しました");
				//io.emit('chat message', "現在の人数は" + user2socket_array.length + "人です.");
				//io.emit('chat message', "親は" + user2socket_array[0].user_id + "です");
				user2socket_array.splice(i,1);
			}
		}
		if(user2socket_array.length == 1){
			io.emit('chat message', "親は" + user2socket_array[0].user_id + "です");
		}
	});
});


http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
