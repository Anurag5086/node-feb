const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (username) => {
        socket.username = username;
        io.emit("user joined", `${username} has joined the chat`);
    })

    socket.on("chat message", (msg) => {
        io.emit("chat message", { username: socket.username, message: msg });
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        if (socket.username) {
            io.emit("user left", `${socket.username} has left the chat`);
        }
    })
})

server.listen(3000, () => {
    console.log("Server is running on port 3000");
})