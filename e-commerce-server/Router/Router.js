const express = require("express");
const Router = express.Router();
const bodyparser = require("body-parser");
const Item = require("../Schema/itemSchema");
const { User, ROLE } = require("../Schema/userSchema");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const mongoose = require("mongoose");

const app = express();
const redis = require("redis").createClient({});

const fs = require("fs");

let Schema = mongoose.Schema;
let country = mongoose.model("Country", new Schema({}), "country");
let state = mongoose.model("State", new Schema({}), "state");
let city = mongoose.model("City", new Schema({}), "city");
let id, role;
let ref = "";

//UPLOADING IMAGE TO STORAGE
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, res, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" || ext !== ".png") {
      console.log("this is not file with jpg or png");
      return cb(res.status(500).end("only jpg, png are allowed"), false);
    }
    cb(null, true);
  },
});

let upload = multer({ storage: storage }).single("MyImg");

Router.post("/uploadImage", authToken, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log("error occured" + err);
      return res.sendStatus(500);
    } else {
      let filedata = {
        image: res.req.file.path,
        fileName: res.req.file.filename,
      };
      return res.status(200).send(filedata);
    }
  });
});

//DELETE IMAGE
Router.delete("/photo/upload/:id", async (req, res) => {
  const imagepath = req.params.id;
  try {
    fs.unlinkSync("upload/" + imagepath);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET THE COUNTRY BY ID'
Router.get("/Country/:id", async (req, res) => {
  const countryId = req.params.id;
  try {
    const result = await country.find({ id: countryId });
    return res.status(200).send(result);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET THE STATE BY ID'
Router.get("/State/:id", async (req, res) => {
  const stateId = req.params.id;
  try {
    const result = await state.find({ id: stateId });
    return res.status(200).send(result);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET THE CITY BY ID'
Router.get("/City/:id", async (req, res) => {
  const cityId = req.params.id;
  try {
    const result = await city.find({ id: cityId });
    return res.status(200).send(result);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET LIST OF COUNTRIES
Router.get("/getCountries", async (req, res) => {
  try {
    const result = await country.find({});
    return res.status(200).send(result);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET LIST OF STATES
Router.get("/getStates/:id", async (req, res) => {
  const statesId = req.params.id;
  try {
    const result = await state.find({ country_id: statesId });
    return res.status(200).send(result);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET LIST OF CITIES
Router.get("/getCities/:id", async (req, res) => {
  const cityId = req.params.id;
  try {
    const result = await city.find({ state_id: cityId });
    return res.status(200).send(result);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//POSTING/ADDING NEW ITEM
Router.post("/item", authToken, async (req, res) => {
  const { title, price, description, image } = req.body;
  if (!title || !price || !description || !image) return res.sendStatus(400);
  try {
    let item = new Item();
    item.title = title;
    item.price = price;
    item.description = description;
    item.image = image;
    item.createdBy = id;
    item.status = "Selling";
    const result = await User.findById(id);
    item.state = result.state;
    const i = await item.save();
    result.item.push(item._id);
    result.save();
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

//EDITING SPECIFIC (ID) ITEM'S STATUS
Router.put("/itemstatus/:id", authToken, async (req, res) => {
  const { status } = req.body;
  try {
    const itemId = { _id: req.params.id };
    const result = await Item.findById(itemId);
    const owner = result.createdBy;
    if (owner !== id) return res.sendStatus(403);
    const results = await Item.findByIdAndUpdate(itemId, { status: status });
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

//EDITING SPECIFIC (ID) ITEM
Router.put("/item/:id", authToken, async (req, res) => {
  const { image, title, price, description } = req.body;
  try {
    const itemId = { _id: req.params.id };
    const update = { image, title, price, description };
    const result = await Item.findById(itemId);
    const owner = result.createdBy;
    if (owner !== id) return res.sendStatus(403);
    const results = await Item.findByIdAndUpdate(itemId, update);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

//EDITING SPECIFIC (ID) USER's INFO
Router.put("/edituserinfo", authToken, async (req, res) => {
  const { firstName, lastName, country, state, city, email } = req.body;
  try {
    const update = { firstName, lastName, country, state, city, email };
    const result = await User.findByIdAndUpdate(id, update);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

//DELETE SPECIFIC (ID) ITEM
Router.delete("/item/:id", authToken, async (req, res) => {
  const itemId = req.params.id;
  try {
    const result = await Item.findById(itemId);
    const images = result.image;
    const owner = result.createdBy;
    if (owner !== id) return res.sendStatus(403);
    try {
      images.forEach((img) => {
        fs.unlinkSync(img);
      });
    } catch (err) {
      return res.sendStatus(400);
    }
    const results = await Item.findByIdAndDelete(itemId);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET INFO ABOUT SPECIFIC (ID) ITEM
Router.get("/item/:id", authToken, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Item.findById(id);
    return res.status(200).send(result);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET INFO ABOUT ALL ITEM IN DB
Router.get("/item", async (req, res) => {
  try {
    const result = await Item.find().sort({ createdAt: -1 });
    return res.status(200).send(result);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET INFO ABOUT ALL USER IN DB
Router.get("/user", authToken, authRole("admin"), async (req, res) => {
  try {
    const result = await User.find();
    return res.send(result);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET THE USER's INFORMATION FOR PROFILE PAGE
Router.get("/userinfo", authToken, async (req, res) => {
  try {
    const result = await User.findById(id);
    return res.status(200).send(result);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET THE USER's INFORMATION FOR PROFILE PAGE
Router.get("/userid", authToken, async (req, res) => {
  try {
    const result = await User.findById(id);
    return res.status(200).send({ result, id });
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET THE USER's INFORMATION FOR PROFILE PAGE
Router.get("/userinfo/:userid", authToken, async (req, res) => {
  const userid = req.params.userid;
  console.log(userid);
  try {
    const result = await User.findById(userid);
    return res.status(200).send({ result, id });
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET THE USER's SPECIFIC ITEMS
Router.get("/userchatitem", authToken, async (req, res) => {
  try {
    const result = await User.findById(id);
    const chat = result.chat;
    const finalItems = async () => {
      return Promise.all(chat.map((itemid) => Item.findById(itemid.itemid)));
    };
    finalItems().then((list) => res.status(200).send(list));
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET THE USER's SPECIFIC ITEMS
Router.get("/useritem", authToken, async (req, res) => {
  try {
    const result = await User.findById(id);
    const items = result.item;
    const finalItems = async () => {
      return Promise.all(items.map((itemid) => Item.findById(itemid)));
    };
    finalItems().then((list) => res.status(200).send(list));
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET THE USER's SPECIFIC ITEMS
Router.post("/rateuser", authToken, async (req, res) => {
  const { rate, seller } = req.body;
  try {
    const result = await User.findById(seller);
    result.rate.push(rate);
    result.save();
    const resultNum = result.rateNumber + 1;
    let resultSum = result.rate.reduce((sum, r) => {
      return sum + r;
    }, 0);
    const resulttotal = resultSum / resultNum;
    const results = await User.findByIdAndUpdate(seller, {
      rateNumber: resultNum,
      rateTotal: resulttotal,
    });
    res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//GET THE USER's CHATS
Router.get("/chathistory", authToken, async (req, res) => {
  try {
    const result = await User.findById(id);
    const chat = result.chat;
    return res.status(200).send(chat);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//CREATE CHAT TO USER
Router.post("/setChat", authToken, async (req, res) => {
  const { buyer, room, seller, itemid } = req.body;
  try {
    const sellerchat = await User.findById(seller);
    const buyerchat = await User.findById(buyer);

    const sellerchatexist = sellerchat.chat.find((sc) => sc.room === room);
    const buyerchatexist = buyerchat.chat.find((sc) => sc.room === room);
    if (!sellerchatexist) {
      sellerchat.chat.push({ room, itemid });
    }
    if (!buyerchatexist) {
      buyerchat.chat.push({ room, itemid });
    }
    sellerchat.save();
    buyerchat.save();
    res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(400);
  }
});

//CREATE USER (FOR SIGNUP PAGE)
Router.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    country,
    state,
    city,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !country ||
    !state ||
    !city
  ) {
    return res.status(400).send("please fill up all contents");
  }
  let user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.country = country;
  user.state = state;
  user.city = city;
  try {
    console.log("1");

    user.password = await bcrypt.hash(password, 10);
    const result = await user.save();
    const refreshToken = await jwt.sign(
      { id: result.id, role: result.role },
      process.env.REFRESH_KEY
    );
    redis.sadd("tokens", refreshToken);
    console.log("2");

    return res
      .cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
        httpOnly: true,
      })
      .sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

//LOG IN USER (FOR LOGIN PAGE)
Router.post("/signin", async (req, res) => {
  let result;
  let refreshToken;
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Either email or password is missing");
  }
  try {
    result = await User.findOne({ email: email });
    if (!result)
      return res.status(400).send("Are you sure you are already registered?");
    if (await bcrypt.compare(password, result.password)) {
      refreshToken = await jwt.sign(
        { id: result.id, role: result.role },
        process.env.REFRESH_KEY
      );
      redis.SADD("tokens", refreshToken);
      return res
        .cookie("refreshToken", refreshToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
          httpOnly: true,
        })
        .sendStatus(200);
    } else {
      return res.sendStatus(400);
    }
  } catch (err) {
    return res.send("adsd").status(400);
  }
});

//SIGNOUT USER (FOR SIGNOUT BUTTON)
Router.get("/signout", parseCookie, (req, res) => {
  const token = ref;
  if (redis.SISMEMBER("tokens", token)) {
    redis.SREM("tokens", token);
    return res.clearCookie("refreshToken").sendStatus(200);
  }
  return res.sendStatus(400);
});

//GET/CHECK ACCESSTOKEN
Router.get("/accesstoken", parseCookie, async (req, res) => {
  const token = ref;
  if (!token) return res.sendStatus(401);
  if (await redis.SISMEMBER("tokens", token)) {
    const { id, role } = await jwt.decode(token);
    const newToken = await jwt.sign({ id, role }, process.env.SECRET_KEY, {
      expiresIn: "30m",
    });
    const expiry = new Date(Date.now() + 1000 * 60 * 30);
    return res.status(200).send({ token: newToken, expiry: expiry });
  }
  return res.sendStatus(400);
});

function authToken(req, res, next) {
  if (req.headers.authorization === undefined)
    return res.status(401).send("you do not have cookie");
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send("error with token");
    console.log("authToken PASS");
    id = user.id;
    role = user.role;
    next();
  });
}

function authRole(role) {
  return async (req, res, next) => {
    if (role !== req.role) return res.sendStatus(403);
    console.log("authrole PASS");
    next();
  };
}

function parseCookie(req, res, next) {
  if (req.headers.cookie === undefined) {
    ref = "";
    next();
  } else {
    const ck = req.headers.cookie.split(" ");
    ref = ck[0].split("=")[1];
    next();
  }
}
module.exports = Router;
