//Create web server
var express = require('express');
var app = express();
//create server
var server = require('http').createServer(app);
//create socket
var io = require('socket.io')(server);

//listen to server
server.listen(3000);

//route
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//create array to store comments
var comments = [];

//listen to connection event
io.on('connection', function(socket){
    console.log('A user connected');

    //send previous comments
    socket.emit('load comments', comments);

    //listen to disconnect event
    socket.on('disconnect', function(){
        console.log('A user disconnected');
    });

    //listen to new comment event
    socket.on('new comment', function(data){
        comments.push(data);
        //send new comment to all clients
        io.sockets.emit('update comments', comments);
    });

    //listen to delete comment event
    socket.on('delete comment', function(data){
        comments.splice(data, 1);
        //send new comment to all clients
        io.sockets.emit('update comments', comments);
    });
});
