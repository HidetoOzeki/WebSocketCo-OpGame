const express = require('express');
const app = express();
const http = require('http');
const server= http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

import Player from 'player.js';

const player_ids = [];
const player_entities = [];

function getEntityById(pid){
    for(var i = 0;i < player_ids.length;i++){
        if(player_ids[i]===pid)return player_entities[i];
    }
    return null;
}

function getEntityIndexById(pid){
    for(var i = 0;i < player_ids.length;i++){
        if(player_ids[i]===pid){
            return i;
        }
    }
    return -1;
}

const keyCode_W = 0x57;
const keyCode_A = 0x41;
const keyCode_S = 0x53;
const keyCode_D = 0x44;

function status_log(){
    console.log("total count of connected players : "+player_entities.length);

}

setInterval(status_log,1000);

function update(){
    for(var i = 0;i < player_entities.length;i++){
        player_entities[i].update();
    }
    io.emit("entity_update",{player_entities,player_ids});
}

var update_interval = 1000.0/60.0;
setInterval(update,update_interval);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

io.on('connection',(socket)=>{
    console.log("a user connected, id is "+socket.id);
    player_ids.push(socket.id);
    player_entities.push(new Player(socket.id));
    io.emit('connection established',socket.id);

    socket.join('room1');

    socket.on('player_input',(keys)=>{
        var vel = 0;
        var dirvel = 0;
        if(keys[keyCode_W])vel+=0.5;
        if(keys[keyCode_A])dirvel+=0.01;
        if(keys[keyCode_S])vel-=0.5;
        if(keys[keyCode_D])dirvel-=0.01;
        var index  = getEntityIndexById(socket.id);
        if(index!=-1)player_entities[index].move(dirvel,vel);
    });

    socket.on('disconnect',()=>{
        console.log("a user disconnected");
        var index = getEntityIndexById(socket.id);
        player_entities.splice(index,1);
        player_ids.splice(index,1);
    });
});

server.listen(7000,()=>{
    console.log('listening on *:7000');
});

