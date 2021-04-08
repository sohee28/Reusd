const { urlencoded } = require("express");
const express = require("express");
const url = require("url");
const router = express.Router();
const { getMessages } = require("./users");

router.get("/", (req, res) => {
  res.send("server is up and running");
});

router.get("/get/:room", (req, res) => {
  const room = req.params.room;
  const messages = getMessages(room);
  if (messages) {
    res.status(200).send(messages);
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
