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
    // console.log(`New Connection: ${socket.id}`)

    // socket.on('join_room', (room_info) => {
    //     socket.join(room_info.room)
    //     console.log(`User Id :- ${socket.id} joined room : ${room_info.room}`)
    // })

    // socket.on('send_message', (data) => {
    //     console.log(`data send`, data)
    //     socket.to(data?.room).emit("receive_message", data)
    // })

    // io.on('disconnect', () => {
    //     console.log(`User Disconnected: ${socket.id}`)
    // })

      socket.on('join_room', (room_info) => {
          socket.join(room_info.room);
          console.log(`User Id: ${socket.id} joined room: ${room_info.room}`);
  
          // Get the number of clients in the room
          const roomUsers = io.sockets.adapter.rooms.get(room_info.room)?.size || 0;
  
          // Emit the updated user count to all users in the room
          io.to(room_info.room).emit('room_user_count', roomUsers);
      });
  
      socket.on('send_message', (data) => {
        
          console.log('data send', data);
          socket.to(data.room).emit('receive_message', data);
      });
  
      socket.on('disconnect', () => {
          console.log(`User Disconnected: ${socket.id}`);
          // delete socket.rooms(socket.id)
          // Broadcast updated user count to all rooms (since the user left)
          socket.rooms.forEach((room) => {
              const roomUsers = io.sockets.adapter.rooms.get(room)?.size || 0;
              io.to(room).emit('room_user_count', roomUsers);
          });
      });
  
}

server.listen(port, () => {
    console.log(`Express project is running on: ${port}`)
})
