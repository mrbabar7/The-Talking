const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthModel",
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      ref: "AuthModel",
      required: true,
    },
    contact: {
      type: String,
      ref: "AuthModel",
      required: true,
    },
    about: {
      type: String,
      default: "Hey There! I am using Chatty",
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProfileModel", profileSchema);
