import "./config/env.js";


import express from "express";


import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import cloudinary from "./config/cloudinary.js";

import errorHandler from "./middleware/errorMiddleware.js";



// Connect database
connectDB();

const app = express();

// Create HTTP server (IMPORTANT for socket.io)
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: "https://nirvana-app-self.vercel.app",
    credentials: true,
  })
);


app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Nirvana backend is running 🧘");
});

// Error handler (always last middleware)
app.use(errorHandler);

// ---------------- SOCKET.IO SETUP ----------------

const io = new Server(server, {
  cors: {
    origin: "https://nirvana-app-self.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  // Join private chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`👥 Socket ${socket.id} joined chat ${chatId}`);
  });

  // Send message to room
  socket.on("sendMessage", ({ chatId, message }) => {
    socket.to(chatId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});


// ------------------------------------------------

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
