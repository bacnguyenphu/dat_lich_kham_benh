const express = require("express");
import cors from "cors";
import connectDB from "./src/config/connectDB";
import initRoutes from "./src/routes/index";
import cookieParser from "cookie-parser";
import handleSocketEvents from "./src/sockets/chatHandler";
const { Server } = require("socket.io");
const http = require("http");

require("dotenv").config();
const port = process.env.PORT || 8888;

const app = express();

const server = http.createServer(app);
app.use(
  cors({
    // origin: process.env.URL_CLIENT, // domain frontend
    origin: true,
    credentials: true, // cho phép gửi cookie
  }),
);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initRoutes(app);

connectDB();

handleSocketEvents(io);

server.listen(port, () => {
  console.log(`Backend & Socket đang chạy chung trên port ${port}`);
});
