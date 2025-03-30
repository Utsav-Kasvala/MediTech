import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRoute from "./Routes/review.js";
import bookingRoute from "./Routes/booking.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Track online doctors and users
const connectedDoctors = {};
const connectedUsers = {};

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Doctor joins chat
  socket.on("doctor_join", (doctorId) => {
    connectedDoctors[doctorId] = socket.id;
    console.log(`Doctor ${doctorId} connected`);
  });

  // User joins chat
  socket.on("user_join", (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`User ${userId} connected`);
  });

  // Handle message sending
  socket.on("send_message", (data) => {
    const { receiverId, senderId } = data;

    const receiverSocketId = connectedDoctors[receiverId] || connectedUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", data);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    Object.keys(connectedDoctors).forEach((doctorId) => {
      if (connectedDoctors[doctorId] === socket.id) delete connectedDoctors[doctorId];
    });

    Object.keys(connectedUsers).forEach((userId) => {
      if (connectedUsers[userId] === socket.id) delete connectedUsers[userId];
    });
  });
});

const corsOptions = {
  origin: true,
};

app.get("/", (req, res) => {
  res.send("API is Working");
});

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB database connected");
  } catch (err) {
    console.error("MongoDB database not connected:", err);
  }
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);

server.listen(port, () => {
  connectDB();
  console.log("Server is running on port " + port);
});