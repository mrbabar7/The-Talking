const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthModel",
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthModel",
      required: true,
    },
    text: String,
    image: [String],
    audio: {
      url: String,
      duration: Number,
    },
    reactions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AuthModel",
        },
        emoji: String,
      },
    ],
    delivered: {
      type: Boolean,
      default: false,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    postStatus: {
      type: String,
      default: "posted",
    },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId }],
    deletedForEveryone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatModel", chatSchema);
