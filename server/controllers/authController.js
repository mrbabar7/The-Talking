const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const crypto = require("crypto");
const AuthModel = require("../models/authModel");
const ProfileModel = require("../models/profileModel");
const sendEmail = require("../utils/sendEmail");
exports.postSignup = [
  check("userName")
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 3 })
    .withMessage("Name should be at least three characters.")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must be alphabetic.")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Enter a valid email address.")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("Invalid email format.")
    .normalizeEmail(),
  check("contact")
    .notEmpty()
    .withMessage("Contact is required.")
    .isLength({ min: 11, max: 11 })
    .withMessage("Contact must be 11 digits long.")
    .matches(/^[0-9]+$/)
    .withMessage("Contact must contain digits only."),
  check("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long.")
    .matches(/^[a-zA-Z0-9!@#$%^&*,]+$/)
    .withMessage("Password should include alphanumeric and special characters.")
    .trim(),

  async (req, res) => {
    try {
      const { userName, email, contact, password } = req.body;

      // Validation Errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create auth user
      const user = new AuthModel({
        userName,
        email,
        contact,
        password: hashedPassword,
      });

      const savedUser = await user.save(); // MUST use await

      console.log("User saved:", savedUser);

      // Auto-create ProfileModel document
      await ProfileModel.create({
        userId: savedUser._id,
        userName: savedUser.userName,
        contact: savedUser.contact,
        about: "Hey there! I am using Chatty.",
        profilePic: "", // default or empty
      });

      return res.status(200).json({
        user: savedUser,
      });
    } catch (error) {
      console.log("Error while signup:", error);
      return res.status(500).json({
        message: error.message || "Signup failed",
      });
    }
  },
];

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthModel.findOne({ email });

    if (!user)
      return res.status(422).json({ err: "Email or Password is incorrect!" });

    const assFinding = await bcrypt.compare(password, user.password);

    if (!assFinding)
      return res.status(422).json({ err: "Email or Password is incorrect!" });

    // FIX: regenerate session before login
    req.session.regenerate(async (err) => {
      if (err) return res.status(500).json({ err: "Session error!" });

      req.session.isLogged = true;
      req.session.user = user;

      await req.session.save();
      console.log("SESSION SAVED:", req.session);

      res.status(200).json({
        user: user.email,
        message: "Login Successful",
      });
    });
  } catch (err) {
    console.log("error while login", err);
    return res.status(500).json({ err: "There is something wrong!" });
  }
};

exports.checkUser = (req, res, next) => {
  try {
    if (req.session.isLogged) {
      return res.status(201).json({ user: req.session.user, isLogged: true });
    } else {
      return res.status(201).json({ isLogged: false });
    }
  } catch (err) {
    console.log("error while checking user: ", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.status(201).json({ isLogged: false });
    });
  } catch (err) {
    console.log(`error while logout: ${err}`);
    res.status(500).json({
      err: err.message || "there is something wrong, please try again",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("reset email is :", email);
    // 1️⃣ Always validate input
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // 2️⃣ Find user (DON'T reveal result)
    const user = await AuthModel.findOne({ email });

    if (!user) {
      // 🔒 SECURITY: Same response even if user not found
      return res.status(200).json({
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    // 3️⃣ Generate reset token (RAW)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 4️⃣ Hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 5️⃣ Save hashed token + expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // 🔗 Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 📧 Email template
    const html = `
  <div style="font-family: Arial, sans-serif;">
    <h2>Password Reset Request</h2>
    <p>You requested to reset your password.</p>
    <p>This link will expire in <strong>15 minutes</strong>.</p>

    <a href="${resetUrl}" 
       style="display:inline-block;
              padding:10px 15px;
              background:#4f46e5;
              color:white;
              text-decoration:none;
              border-radius:5px;">
      Reset Password
    </a>

    <p>If you did not request this, ignore this email.</p>
  </div>
`;

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html,
    });

    // 6️⃣ For now, just return token (EMAIL comes next step)
    return res.status(200).json({
      message:
        "If an account with that email exists, a reset link has been sent.",
      // resetToken,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        error: "Password is required and atleast 6 Laurey!",
      });
    }

    // 1️⃣ Hash incoming token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2️⃣ Find user with valid token
    const user = await AuthModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Token is invalid or expired",
      });
    }

    // 3️⃣ Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4️⃣ Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message || "Server error",
    });
  }
};

// app password : fiaw emfs ckui jxhs
