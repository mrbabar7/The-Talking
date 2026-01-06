import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import ChatModel from "../models/chatModel.js";
const app = express();
const server = http.createServer(app);
const CLIENT_URL = process.env.CLIENT_URL || "";
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL ? [CLIENT_URL] : true,
    credentials: true,
  },
});
export function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user is connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    socket.userId = userId;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("messageSeen", async ({ senderId }) => {
    try {
      // 1️⃣ Update unseen messages
      const result = await ChatModel.updateMany(
        {
          senderId,
          recieverId: socket.userId,
          seen: false,
        },
        { seen: true }
      );

      // 2️⃣ Fetch only updated message IDs
      const updatedMessages = await ChatModel.find(
        {
          senderId,
          recieverId: socket.userId,
          seen: true,
        },
        { _id: 1 }
      );

      const senderSocketId = getRecieverSocketId(senderId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", {
          messageIds: updatedMessages.map((m) => m._id.toString()),
        });
      }
    } catch (err) {
      console.log("err while creating event ", err);
    }
  });

  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getRecieverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", {
        senderId: socket.userId,
      });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getRecieverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", {
        senderId: socket.userId,
      });
    }
  });

  socket.on("reactMessage", async ({ messageId, emoji }) => {
    const userId = socket.userId;

    const message = await ChatModel.findById(messageId);
    if (!message) return;
    message.reactions = message.reactions.filter(
      (r) => r.userId.toString() !== userId
    );
    message.reactions.push({ userId, emoji });
    await message.save();

    const receiverSocketId = getRecieverSocketId(
      message.senderId.toString() === userId
        ? message.recieverId
        : message.senderId
    );
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageReaction", {
        messageId,
        reactions: message.reactions,
      });
    }

    socket.emit("messageReaction", {
      messageId,
      reactions: message.reactions,
    });
  });

  socket.on("deleteMessage", async ({ messageId, type }) => {
    const message = await ChatModel.findById(messageId);
    if (!message) return;

    if (type === "me") {
      // delete only for current user
      if (!message.deletedFor.includes(socket.userId)) {
        message.deletedFor.push(socket.userId);
      }
    }

    if (type === "everyone") {
      // only sender can delete for everyone
      if (message.senderId.toString() !== socket.userId) return;

      message.deletedForEveryone = true;
      message.text = "";
      message.image = [];
      message.reactions = [];
    }

    await message.save();

    io.emit("messageDeleted", {
      messageId,
      type,
      userId: socket.userId,
    });
  });

  socket.on("disconnect", () => {
    console.log("a user is disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };

// zWyiAI8x1TkAzLgq
