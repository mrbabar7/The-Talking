const ProfileModel = require("../models/profileModel");
const ChatModel = require("../models/chatModel");
const { getRecieverSocketId, io } = require("../lib/socket");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
exports.contactList = async (req, res) => {
  try {
    const myId = req.session.user._id;
    const profiles = await ProfileModel.find({ userId: { $ne: myId } });
    res.status(200).json({ contacts: profiles });
  } catch (err) {
    console.log("error during Fetch contacts:", err);
    res.status(500).json({
      err: err.message || "Server error",
    });
  }
};
exports.getChatMessages = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.session.user._id;
    console.log("id of chatting contact:", contactId);
    const messages = await ChatModel.find({
      $or: [
        { senderId: contactId, recieverId: userId },
        { senderId: userId, recieverId: contactId },
      ],
    });
    res.status(201).json({ messages });
  } catch (err) {
    console.log("error during Fetch chat-contact:", err);
    res.status(500).json({
      err: err.message || "Server error",
    });
  }
};
exports.chatContact = async (req, res) => {
  try {
    const { contactId, text, clientTempId } = req.body;
    const userId = req.session.user._id;
    console.log("id of chatting:", contactId, text);
    let imageUrl = [];

    // Upload image if provided
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      console.log("img array is:", images);
      for (const img of images) {
        try {
          const uploaded = await cloudinary.uploader.upload(img.tempFilePath, {
            folder: "chatty_users",
          });
          imageUrl.push(uploaded.secure_url);
        } catch (error) {
          console.log("error during uploading img to cloudinary:", error);
          return res.status(500).json({
            error: "Error in uploading image",
          });
        }
      }
    }
    const sendingChat = new ChatModel({
      senderId: userId,
      recieverId: contactId,
      text,
      image: imageUrl,
      delivered: false,
      seen: false,
      postStatus: "posted",
    });
    console.log("sendingChat is:", sendingChat);
    await sendingChat.save();
    const recieverSocketId = getRecieverSocketId(contactId);
    if (recieverSocketId) {
      sendingChat.delivered = true;
      await sendingChat.save();
      io.to(recieverSocketId).emit("newMessage", sendingChat);
    }
    res.status(201).json({ ...sendingChat.toObject(), clientTempId });
  } catch (error) {
    console.log("error during Fetch chat-contact:", error);
    res.status(500).json({
      error: "There is something wrong! Please try again",
    });
  }
};

exports.voiceMessage = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { contactId, clientTempId } = req.body;

    if (!req.files || !req.files.audio) {
      return res.status(400).json({ err: "Audio file missing" });
    }

    const audioFile = req.files.audio;

    // Upload to Cloudinary
    const uploaded = await cloudinary.uploader.upload(audioFile.tempFilePath, {
      folder: "chatty_users/voice",
      resource_type: "video", // audio is video in cloudinary
    });

    const message = await ChatModel.create({
      senderId: userId,
      recieverId: contactId,
      audio: {
        url: uploaded.secure_url,
        duration: uploaded.duration || 0,
      },
      delivered: false,
      seen: false,
      postStatus: "posted",
    });
    // SOCKET DELIVERY
    const receiverSocketId = getRecieverSocketId(contactId);
    if (receiverSocketId) {
      message.delivered = true;
      await message.save();

      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json({ ...message.toObject(), clientTempId });
  } catch (err) {
    console.error("Voice message error:", err);
    res.status(500).json({ err: "There is something wrong! Please try again" });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const myId = new mongoose.Types.ObjectId(req.session.user._id);
    const conversations = await ChatModel.aggregate([
      {
        $match: {
          $or: [{ senderId: myId }, { recieverId: myId }],
        },
      },

      { $sort: { createdAt: -1 } },

      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$senderId", myId] }, "$recieverId", "$senderId"],
          },
          lastMessageDoc: { $first: "$$ROOT" },

          lastMessageAt: { $first: "$createdAt" },

          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$recieverId", myId] },
                    { $eq: ["$seen", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $lookup: {
          from: "profilemodels",
          localField: "_id",
          foreignField: "userId",
          as: "profile",
        },
      },

      { $unwind: "$profile" },

      {
        $project: {
          userId: "$profile.userId",
          userName: "$profile.userName",
          profilePic: "$profile.profilePic",
          unreadCount: 1,
          lastMessageAt: 1,

          // 🔥 THIS IS THE ONLY PLACE WHERE lastMessage IS DECIDED
          lastMessage: {
            $cond: [
              {
                $gt: [
                  {
                    $strLenCP: {
                      $ifNull: ["$lastMessageDoc.audio.url", ""],
                    },
                  },
                  0,
                ],
              },
              "🎤 Voice message",
              {
                $cond: [
                  {
                    $gt: [
                      {
                        $size: {
                          $ifNull: ["$lastMessageDoc.image", []],
                        },
                      },
                      0,
                    ],
                  },
                  "📷 Image",
                  {
                    $ifNull: ["$lastMessageDoc.text", ""],
                  },
                ],
              },
            ],
          },
        },
      },
    ]);

    console.log("CONVERSATIONS:", conversations.length);
    res.status(200).json(conversations);
  } catch (err) {
    console.error("Conversation error:", err);
    res.status(500).json({ error: err.message });
  }
};
