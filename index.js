const express = require('express');
const socket = require('socket.io');

const app = express();

const server = app.listen(process.env.PORT || 3000);

let io = socket(server);
app.use(express.static('public'));
let f = 0;
let players = ['0','0'];
io.on('connection',(socket)=>{
    
            if(players[0] == 0)
            {
                players[0] = socket.id;
            }
            else
            {
                players[1] = socket.id;
            }

            if(players[0] != 0 && players[1] != 0)
            {
                io.sockets.emit('ok',players);
            }
            console.log("Users count: ",players.length);
    socket.on('disconnect',()=>{
        console.log("disconnected",socket.id,players);
        if(socket.id == players[0])
        {
            players[0] = 0;
        }
        if(socket.id == players[1])
        {
            players[1] = 0;
        }
    });
    socket.on('start',()=>{
        io.sockets.emit('start',null);
    })
    
    socket.on('update',data =>{
        
        socket.broadcast.emit('update',data);
    })

})