// Make connection
const socket = io.connect();

// Query DOM
const message = document.querySelector(".message");
const user = document.querySelector(".user");
const output = document.querySelector(".chat__output");
const feedback = document.querySelector(".chat__feedback");
const chatbox = document.querySelector(".chat__box");
const chatOutput = document.querySelector(".chat__output");

// Chat event
// Step 1: Handle chat event - send message down to the server
chatbox.addEventListener("submit", (e) => {
  e.preventDefault();

  // Send message down to the sever
  // Validation
  if (message.value && user.value) {
    //remove error state
    message.classList.remove("message--error");
    user.classList.remove("user--error");
    //send message
    socket.emit("chat", {
      message: message.value,
      user: user.value,
    });
    //empty out input field
    message.value = "";
  } else {
    if (!message.value) {
      message.classList.add("message--error");
    }
    if (!user.value) {
      user.classList.add("user--error");
    }
  }
});

// Step 2: Listen for chat events
socket.on("chat", (data) => {
  feedback.innerHTML = "";
  if (data.user === user.value) {
    output.innerHTML += `<p class="chat__output-text chat__output-text--sender"><span class="chat__output-user chat__output-user--sender ">${data.user}</span>${data.message}</p>`;
    chatOutput.scrollIntoView({ behavior: "smooth", block: "end" });
  } else {
    output.innerHTML += `<p class="chat__output-text"><span class="chat__output-user">${data.user}</span>${data.message}</p>`;
    chatOutput.scrollIntoView({ behavior: "smooth", block: "end" });
  }
});

// Typing event
// Handle typing in the input field
message.addEventListener("keypress", () => {
  socket.emit("typing", user.value);
});

// Listen for type event
socket.on("typing", (data) => {
  feedback.innerHTML = `<p class="chat__feedback-text"> ${data} is typing a message...</p>`;
  chatOutput.scrollIntoView({ behavior: "smooth", block: "end" });
});

// Disconnect event
socket.on("user disconnect", (data) => {
  output.innerHTML += `<p class="chat__feedback-text">${data}</p>`;
  chatOutput.scrollIntoView({ behavior: "smooth", block: "end" });
});
