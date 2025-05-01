// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./utils/db.js";

// routes
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import bankRoute from "./routes/bank.route.js";
import searchFilterRoute from "./routes/searchFilter.route.js";
import messageRoute from "./routes/message.route.js";
import notificationRoute from "./routes/notification.route.js";

dotenv.config();
const app = express();
const server = http.createServer(app); // Use HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/bank", bankRoute);
app.use("/api/searchFilter", searchFilterRoute);
app.use("/api/messages", messageRoute);
app.use("/api/notification", notificationRoute);

// Store users and socket ids
const users = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    users.set(userId, socket.id);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const receiverSocketId = users.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        text,
        createdAt: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
  connectDB();
});
