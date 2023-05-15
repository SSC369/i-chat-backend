const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const mongoUrl = process.env.MONGODB_CONNECTION_LINK;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to mongo Successful");
  } catch (error) {
    console.log(error.message);
  }
};

connectToMongo();

const app = express();
app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,PUT,POST,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Authorization, X-Requested-With, Content-Type"
  );
  next();
});

const server = app.listen(5000, () => console.log(`Server started on 5000`));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use("/", (req, res) => {
  res.send("Hi SSC");
});

const io = socket(server, {
  cors: {
    origin: "https://ichat-67235e.netlify.app",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);

  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
