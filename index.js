const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Set up port
dotenv.config();
const PORT = process.env.PORT ?? 4000;

// Static files
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("made socket connection", socket.id);

  // Handle chat event
  socket.on("chat", (data) => {
    // console.log(data);
    io.sockets.emit("chat", data);
  });

  // Handle typing event
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});

server.listen(PORT, () => {
  console.log(`listening for requests on port ${PORT} 🚀`);
});
