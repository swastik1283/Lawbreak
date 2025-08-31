export class Player{
    constructor(id,socket){
        this.id=id;
        this.socket=socket;
        this.position=0;
        this.ready=false;
        this.movesleft=6;
    }

    rollDice(){
        if(this.movesleft<=0) return null;
        const dice=Math.floor(Math.random()*6)+1;
        this.score+=dice;
        this.movesleft-=1;
        return dice;
    }

    hasMovesleft(){
        return this.movesleft>0;
    }
}