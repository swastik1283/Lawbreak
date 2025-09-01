import express from 'express';
 import http from 'http';
 import {Server} from 'socket.io';
import { GameManager } from './gameManager.js';
 const app=express()
 const server=http.createServer(app)
 const io=new Server(server,{cors:{origin:'*'}});

 const game=new GameManager(io);
 io.on('connection',(socket)=>{
    console.log("Player connected",socket.id)
 
 game.addplayer(socket);

 socket.on("roll-dice",()=>{
    game.handleroll(socket);
 })
 socket.on('disconnect',()=>{
    console.log("Player disconnected",socket.id)
    game.removePlayer(socket.id);
 });

});

const PORT=5000;
server.listen(PORT,()=>console.log(`server running on port${PORT}`))