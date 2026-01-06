const mongoose = require("mongoose");
const authSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    contact: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("AuthModel", authSchema);
