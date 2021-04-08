const users = [];
const lists = [];

const addRoom = (roomName) => {
  //console.log("lists:" + JSON.stringify(lists));
  const room = { room: roomName, messages: [] };
  lists.push(room);
};

const addMessages = (message, user, room) => {
  const temp = { message, user: user };
  const rooms = lists.find((e) => {
    return e.room === room;
  });
  rooms.messages.push(temp);
};

const getMessages = (room) => {
  const rooms = lists.find((e) => {
    return e.room === room;
  });
  if (rooms) return rooms;
};

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );
  if (existingUser !== undefined) {
    removeUser(id);
  }

  const user = { id, name, room };
  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getMessages,
  addMessages,
  addRoom,
};
