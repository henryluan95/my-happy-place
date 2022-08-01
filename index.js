const express = require("express");
const socket = require("socket.io");
const dotenv = require("dotenv");

// Set up port
dotenv.config();
const PORT = process.env.PORT ?? 4000;

// App setup
const app = express();
const server = app.listen(PORT, function () {
  console.log(`listening for requests on port ${PORT} 🚀`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

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
