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
        this.id = "";
        this.color = Math.random()*0xffffff;
    }

    setname(n){
        this.name = n;
    }
    setID(id){
        this.id = id;
    }

    move(d,v){
        this.dirvel+=d;
        this.vel+=v;
    }

    update(){
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