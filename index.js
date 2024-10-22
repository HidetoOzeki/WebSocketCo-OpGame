const express = require('express');
const app = express();
const http = require('http');
const server= http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let players = [];

function update(){
    for(var i = 0;i < players.length;i++){
        players.update();
    }
}
var update_interval = 1000.0/30.0;
setInterval(update,update_interval);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

io.on('connection',(socket)=>{
    console.log("a user connected");
    socket.join('room1');
    socket.on('disconnect',()=>{
        console.log("a user disconnected");
    });
});

server.listen(7000,()=>{
    console.log('listening on *:7000');
});

