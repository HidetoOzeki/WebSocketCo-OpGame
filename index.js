const express = require('express');
const app = express();
const http = require('http');
const server= http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

class Player {
    constructor(id){
        this.vx = 0;
        this.vy = 0;

        this.x = 0;
        this.y = 0;

        this.dir = 0;
        this.vel = 0;
        this.dirvel = 0;
        this.name = "john"
        this.color = Math.random()*0xffffff;
        this.id = id;

        this.d = 0; //dirvel
        this.v = 0;
    }

    setname(n){
        this.name = n;
    }

    move(d,v){
        this.d=d;
        this.v=v;
    }

    update(){
        this.dirvel+=this.d;
        this.vel+=this.v;

        this.vx += Math.sin(this.dir)*this.vel;
        this.vy += Math.cos(this.dir)*this.vel;

        this.vy*=0.95;
        this.vx*=0.95;
        this.dirvel*=0.90;

        this.x+=this.vx;
        this.y+=this.vy;
        this.dir+=this.dirvel;

        this.vel=0;
    }

}

const player_ids = [];
const player_entities = [];

function getEntityById(pid){
    for(var i = 0;i < player_ids.length;i++){
        if(player_ids[i].equals(pid))return player_entities[i];
    }
    return null;
}

function getEntityIndexById(pid){
    for(var i = 0;i < player_ids.length;i++){
        if(player_ids[i].equals(pid)){
            return i;
        }
    }
    return -1;
}

const keyCode_W = 0x57;
const keyCode_A = 0x41;
const keyCode_S = 0x53;
const keyCode_D = 0x44;

function update(){
    for(var i = 0;i < player_entities.length;i++){
        player_entities[i].update();
    }
    io.emit("entity_update",{player_entities,player_ids});
    console.log(player_entities.length);
}

var update_interval = 1000.0/30.0;
setInterval(update,update_interval);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

io.on('connection',(socket)=>{
    console.log("a user connected, id is "+socket.id);
    player_ids.push(socket.id);
    player_entities.push(new Player(socket.id)); //配列に追加されない
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
        player_entities.splice(getEntityIndexById(socket.id),1);
    });
});

server.listen(7000,()=>{
    console.log('listening on *:7000');
});

