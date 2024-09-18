import express from "express";
import cors from "cors"
import { Server } from "socket.io";
import http from 'http'

const app = express();

const port = process.env.port || 4001

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ['GET', 'PUT', 'POST']
    }
})

app.use(cors())

app.get('/', (req, res) => {
    res.send("<h2>Hello express</h2>")
})

io.on('connection', onConnected)

function onConnected(socket){
    console.log(`New Connection: ${socket.id}`)

    socket.on('join_room', (room_info) => {
        socket.join(room_info.room)
        console.log(`User Id :- ${socket.id} joined room : ${room_info.room}`)
    })

    socket.on('send_message', (data) => {
        console.log(`data send`, data)
        socket.to(data?.room).emit("receive_message", data)
    })

    // socket.to()

    io.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`)
    })
}

server.listen(port, () => {
    console.log(`Express project is running on: ${port}`)
})
