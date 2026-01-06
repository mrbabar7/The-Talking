const AuthModel = require("../models/authModel");
const ProfileModel = require("../models/profileModel");
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.addProfile = async (req, res) => {
  try {
    const userId = req.session.user._id;
    console.log("my id is tati:", userId);

    const profile = await AuthModel.findById(userId).lean();
    const profileData = await ProfileModel.findOne({ userId }).lean();
    if (!profile) {
      return res.status(404).json({ err: "No profile found" });
    }
    // console.log("my profile:", profile, profileData);
    const mergedProfile = {
      ...profile,
      ...(profileData || {}),
    };

    res.status(200).json({ profile: mergedProfile });
  } catch (err) {
    console.log("error during Fetch contacts:", err);
    res.status(500).json({
      err: err.message || "Server error",
    });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const { userName, contact, about } = req.body;
    let imageUrl = "";

    // Upload image if provided
    if (req.files && req.files.image) {
      const img = req.files.image;
      console.log("img is:", img);
      try {
        const uploaded = await cloudinary.uploader.upload(img.tempFilePath, {
          folder: "chatty_users",
        });
        imageUrl = uploaded.secure_url;
      } catch (uploadErr) {
        return res.status(500).json({
          message: "Image upload failed",
          error: uploadErr.message,
        });
      }
    }

    // 1️⃣ UPDATE AUTH MODEL (name + contact)
    await AuthModel.findByIdAndUpdate(
      userId,
      {
        userName,
        contact,
      },
      { new: true }
    );

    // 2️⃣ UPDATE OR CREATE PROFILE MODEL
    let profile = await ProfileModel.findOne({ userId });

    if (!profile) {
      // Create profile if not exists
      profile = await ProfileModel.create({
        userId,
        userName,
        contact,
        about,
        profilePic: imageUrl,
      });
    } else {
      // Update profile
      profile.userName = userName;
      profile.contact = contact;
      profile.about = about;
      if (imageUrl) profile.profilePic = imageUrl;
      await profile.save();
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while updating profile",
      error: err.message,
    });
  }
};
