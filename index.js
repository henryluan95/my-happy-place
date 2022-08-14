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

// Store current user
let user = "";

io.on("connection", (socket) => {
  console.log("made socket connection", socket.id);
  // Handle login event
  socket.broadcast.emit("user connect", `A new user is connected`);

  // Handle chat event
  socket.on("chat", (data) => {
    io.to(socket.id).emit("chat", data);
    user = data.user;
  });

  socket.on("chat", (data) => {
    socket.broadcast.emit("chat", data);
  });

  // Handle typing event
  socket.on("typing", (data) => {
    if (user !== data) {
      user = data;
    }
    socket.broadcast.emit("typing", data);
  });

  //Handle logout event
  socket.on("disconnect", () => {
    console.log(user);
    io.emit("user disconnect", `${user || "Anonymous user"} is disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`listening for requests on port ${PORT} 🚀`);
});
