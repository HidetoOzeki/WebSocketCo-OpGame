class Player {
    constructor(){
        this.vx = 0;
        this.vy = 0;

        this.x = 0;
        this.y = 0;

        this.dir = 0;
        this.vel = 0;
        this.dirvel = 0;
        this.name = "john"
        this.color = Math.random()*0xffffff;
        this.id = "";

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

module.exports = Player;