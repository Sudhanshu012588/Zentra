import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Routes from "./Routes/UserRoutes.js"
import NudgeRoute from "./Routes/NudgeRoutes.js"
import connectDB from './DB/DBconfig.js';
import Community from './Routes/Community.js';
import { createServer } from "http";
import { Server } from "socket.io";
import { message } from './Models/Messages.js';
import {Zenithchatt} from "./gemini/NudgeAutomation.js"
dotenv.config({ path: './.env' });
const app = express();

// CORS config
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true, // allows cookies if needed
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
connectDB()

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);
// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Sudhanshu",
    role: "Manager"
  });
});


io.on("connection", (socket) => {
  console.log(`🟢 Connected: ${socket.id}`);

  // Handle user joining a community room
  socket.on("GotConnected", async ({ id: communityId }) => {
    try {
      socket.join(communityId);

      const history = await message.find({ Community: communityId }).sort({ createdAt: 1 });

      socket.emit("retrive-message", history); // Send history only to the user
    } catch (error) {
      console.error("Error fetching community history:", error);
      socket.emit("retrive-message", []); // fail-safe
    }
  });

  // Handle regular user message
  socket.on("send-message", async (msgObj) => {
    try {
      const saved = await message.create({
        sender: msgObj.sender,
        senderProfile: msgObj.senderProfile,
        message: msgObj.text,
        Community: msgObj.communityId,
      });

      if (saved) {
        io.to(msgObj.communityId).emit("new-message", saved);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Handle Zenith (AI) query
  socket.on("zenith", async (msgObj) => {
    try {
      // Save user's question in DB
      await message.create({
        sender: msgObj.sender,
        senderProfile: msgObj.senderProfile,
        message: msgObj.text,
        Community: msgObj.communityId,
      }).then((res)=>{
        io.to(msgObj.communityId).emit("new-message", res);
      });

      // Fetch full history for context
      const messages = await message.find({ Community: msgObj.communityId }).sort({ createdAt: 1 });

      const formattedHistory = messages
        .map((m) => `${m.sender}: ${m.message}`)
        .join('\n');

      const prompt = `
COMMUNITY NAME: ${msgObj.communityName}
DESCRIPTION: ${msgObj.communityDescription}

CHAT HISTORY:
${formattedHistory}

USER QUESTION:
${msgObj.text}
      `;

      // Ask Gemini
      const zenithReply = await Zenithchatt(prompt);

      // Save Zenith's reply to DB
      const aiMessage = await message.create({
        sender: 'Zenith',
        senderProfile: 'https://res.cloudinary.com/dzczys4gk/image/upload/v1751615291/chatbot_oic9bz.png', // Optional: Add a bot avatar if needed
        message: zenithReply,
        Community: msgObj.communityId,
      });

      // Send AI message to all members
      io.to(msgObj.communityId).emit("new-message", aiMessage);
    } catch (error) {
      console.error("Zenith error:", error);
      socket.emit("zenith-response", "Zenith can't respond right now.");
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 Disconnected: ${socket.id}`);
  });
});


app.use("/user",Routes)
app.use("/Nudge",NudgeRoute)
app.use('/community',Community)
// Server Listen
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  //console.log(`🚀 Server (with Socket.io) is running on http://localhost:${PORT}`);
});
