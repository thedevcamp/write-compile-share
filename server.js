const express= require('express');
const app=express();
const http=require('http');
const path = require('path');
var Axios = require('axios');

const {Server}= require('socket.io');
const ACTIONS= require('./src/Actions');
const server= http.createServer(app);

const io=new Server(server);
app.use(express.json());
var cors = require('cors')

app.use(cors())
app.post("/", (req, res) => {
    //getting the required data from the request
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;
    console.log(code)
    if (language === "python") {
        language="py"
    }
 
    let data = ({
        "code": code,
        "language": language,
        "input": input
    });
    let config = {
        method: 'post',
        url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    //calling the code compilation API
    Axios(config)
        .then((response)=>{
            res.send(response.data)
            console.log(response.data)
        }).catch((error)=>{
            console.log(error);
        });
})
app.use(express.static('build'));
app.use((req,res,next)=>{
res.sendFile(path.join(__dirname,'build','index.html'))
})
const userSocketMap={}
function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) ||[]).map((socketId)=>{
        return {
            socketId,
            username:userSocketMap[socketId],
        }
    });

}
io.on('connection',(socket)=>{
    console.log('socket connected',socket.id);

    socket.on(ACTIONS.JOIN,({roomId,username})=>{
        userSocketMap[socket.id]=username;
        socket.join(roomId);
        const clients=getAllConnectedClients(roomId);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketId:socket.id,
            });
        })

    });

    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
            code
        })
    })
    socket.on(ACTIONS.SYNC_CODE,({code,socketId})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
            code
        })
    })


    socket.on('disconnecting',()=>{
        const rooms=[...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId: socket.id,
                username:userSocketMap[socket.id],
            })
        })
       delete userSocketMap[socket.id];
        socket.leave();
    })
})

const PORT=process.env.PORT || 5000
server.listen(PORT,() => console.log(`Listening on Port ${PORT}`));