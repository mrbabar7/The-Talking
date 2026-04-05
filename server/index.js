const express = require("express");
const { app } = require("./lib/socket"); // Note: server.listen won't work on Vercel
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const os = require("os");
const MongoStore = require("connect-mongo");
const { authRouter } = require("./routes/authRoutes");
const { chatRouter } = require("./routes/chatRoutes");
const { profileRouter } = require("./routes/profileRoutes");
const { urlencoded } = require("body-parser");

dotenv.config();

// Middleware
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  }),
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    createParentPath: true,
  }),
);

// Database Connection Logic (Serverless optimized)
let isConnected = false;
const connectDB = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
};

// Apply DB connection to all requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Session Management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "xyzabc555",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: true, // Vercel is always HTTPS
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

// Routes
app.use("/api/auth", authRouter); // Good practice to prefix auth
app.use("/api/chat", chatRouter);
app.use("/api/profile", profileRouter);

// Export for Vercel
module.exports = app;
