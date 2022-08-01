// Make connection
// const socket = io.connect("http://localhost:4000/");
const socket = io();

// Query DOM
const message = document.querySelector(".message");
const user = document.querySelector(".user");
const output = document.querySelector(".chat__output");
const feedback = document.querySelector(".chat__feedback");
const chatbox = document.querySelector(".chat__box");

// Chat event
// Step 1: Handle chat event - send message down to the server
chatbox.addEventListener("submit", (e) => {
  e.preventDefault();

  //send message down to the sever
  socket.emit("chat", {
    message: message.value,
    user: user.value,
  });

  //empty out input field
  message.value = "";
});

// Step 2: Listen for chat events
socket.on("chat", (data) => {
  feedback.innerHTML = "";
  output.innerHTML += `<p class="chat__output-text"><span class="chat__output-user">${data.user}: </span>${data.message}</p>`;
});

// Typing event
// Handle typing in the input field
message.addEventListener("keypress", () => {
  socket.emit("typing", user.value);
});

socket.on("typing", (data) => {
  feedback.innerHTML = `<p class="chat__feedback-text"> ${data} is typing a message...</p>`;
});
