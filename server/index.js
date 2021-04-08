const express = require("express");
const http = require("http");
const cors = require("cors");
const PORT = 5001;
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    credentials: true,
    exposedHeaders: ["set-cookie"],
    origin: "http://localhost:3000",
  })
);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  addMessages,
  addRoom,
} = require("./users");

io.on("connection", (socket) => {
  console.log("connnnnneeeect");
  socket.on("join", ({ name, room }, callback) => {
    addRoom(room);
    const { user } = addUser({ id: socket.id, name, room });

    socket.join(user.room);

    /*socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });
    /*socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });*/

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    addMessages(message, user, user.room);
    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });
  socket.on("dc", (id, room) => {
    removeUser(id);
  });
});

const router = require("./router");

app.use(router);

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
