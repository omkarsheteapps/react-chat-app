import { Server } from "socket.io"
import express from "express"

const app = express();

const PORT = process.env.PORT || 3003;

const httpServer = app.listen(PORT, () => {
    console.log(`Server is now listening to PORT ${PORT}`)
});


const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {

    console.log(`User ${socket.id} connected`);

    socket.on("user_join_room", (data) => {
        const { roomId, username } = data || {};

        socket.join(roomId);

        socket.to(roomId).emit("user_join_room", `${username} has joined the chat`)

        console.log(`${username} has joined the room ${roomId}`);
    })

    socket.on("user_left_room", ({ username, roomId }) => {
        socket.to(roomId).emit("message", { username, text: `${username} has left the chat`, type: "notif" })
    })


    socket.on("send_message", ({ username, roomId, text }) => {
        socket.to(roomId).emit("message", { username, text, type: "message" })
    })

    socket.on("user_typing", ({ username, roomId }) => {
        socket.to(roomId).emit("user_typing", username)
    })
})