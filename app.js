var express = require("express");
var app = express();
//const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var path = require("path");
var favicon = require("static-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

app.get(`/movie`, (req, res) => {
  res.sendFile(__dirname + '/movie.html');
});
app.get(`/`, (req, res) => {
  res.sendFile(__dirname + '/top.html');
});
app.use(express.static(path.join(__dirname, "public")));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});