import { Player } from "./playerManager.js";

const stairs={
    3:22,
    4:35,
    5:44
};


const snakes={
    23:12,
    6:2,
    10:3,
}

export class GameManager{
    constructor(io){
        this.io=io;
        this.players={};
        this.currentTurn=null;
    }
   
    addplayer(socket){
        if(!this.players[socket.id]){
           this.players[socket.id]=new Player(socket.id,socket)
           socket.emit('your-id',socket.id);
           socket.emit('players-update',Object.keys(this.players).map(id=>({
            id,
            score:this.players[id].score,
            movesleft:this.players[id].movesleft,
            position:this.players[id].position
           })));

           this.broadcastPlayers();
           if(Object.keys(this.players).length===2){
            this.startgame()
           }
        }
    }

    
    
    removePlayer(id){
        delete this.players[id];
        this.broadcastPlayers();
        
    }
    notifyturn(){
        const ids=Object.keys(this.players);
        ids.forEach(id=>{
            if(id=== this.currentTurn){
                this.players[id].socket.emit("your-turn",{turn:id});

            }else{
                this.players[id].socket.emit("wait-turn",{turn:this.currentTurn});
            }

        });
    }
    handleroll(socket){
        if(socket.id!==this.currentTurn){
            socket.emit("not-your-turn");
            return ;
        }
        const player=this.players[socket.id];
        if(!player)return ;

        const dice=player.rollDice();
        if(dice===null){
            socket.emit("no-moves-left");
            return ;
        }

        let newPos=player.position+dice;
      
        if(stairs[newPos]){
            newPos=stairs[newPos];
            player.position=newPos;
        }
        else if(snakes[newPos]){
            newPos=snakes[newPos];
            player.position=newPos
        }
          if(newPos<=100){
            player.position=newPos;
        }

        this.io.emit("player-rolled",{
            playerId:player.id,
            dice,
            score:player.score,
            movesleft:player.movesleft,
            position:player.position,
        });
        if(player.position===100){
            this.io.emit('game-over',{
                winner:player.id,
                position:Object.fromEntries(
                    Object.values(this.players).map(p=>[p.id,p.position])
                )
            });
            return;
        }
        this.switchTurn()

        this.checkGameEnd()
    }
    switchTurn(){
        const ids=Object.keys(this.players);
        if(ids.length===2){
           this.currentTurn= (this.currentTurn===ids[0]?ids[1]:ids[0]);
            this.io.emit("turn-change",{turn:this.currentTurn});
            this.notifyturn();
        }
    }
    
    checkGameEnd(){
        const playerArr=Object.values(this.players);
        if(
            playerArr.length===2 &&
            !playerArr[0].hasMovesleft()&&
            !playerArr[1].hasMovesleft())
            {
                const[p1,p2]=playerArr;
                let winner=null;
            if(p1.score>p2.score ) winner=p1.id;
            else if(p2.score>p1.score) winner=p2.id;

            this.io.emit("game-over",{
                winner,
                scores:{
                    [p1.id]:p1.score,
                    [p2.id]:p2.score
                },
                position:Object.fromEntries([
                    [p1.id,p1.position],
                    [p2.id,p2.position],
                ]),
            })
            }
            
        
    }
    broadcastPlayers(){
        this.io.emit("players-update",
            Object.keys(this.players).map(id=>({
                id,
                score:this.players[id].score,
                movesleft:this.players[id].movesleft,
               position:this.players[id].position
            })));

    }

    startgame(){
        const playerIds=Object.keys(this.players);
        if(playerIds.length==2){
            this.currentTurn=playerIds[0];
            this.io.emit("gamestart",{players:playerIds,turn:this.currentTurn});
            this.notifyturn();
        }
    }
 
    
}