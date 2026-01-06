const express = require("express");
const { app, server } = require("./lib/socket");
// const app = express();
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
app.use(urlencoded({ extended: false }));
app.use(express.json());
const MONGO_URL = process.env.MONGO_URL;
app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL : true,
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(), // important: explicit temp dir
    createParentPath: true,
  })
);
const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  collectionName: "sessions",
});
store.on("error", (err) => {
  console.error("❌ SESSION STORE ERROR:", err);
});
app.use(
  session({
    secret: process.env.SESSION_SECRET || "xyzabc555",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use("/", authRouter);
app.use("/api", chatRouter);
app.use("/api/profile", profileRouter);
const PORT = process.env.PORT || 5000;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("mongo db is connected");
    server.listen(PORT, () => {
      console.log(`server is running at port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`error while connecting to DB : ${error}`);
  });

// Serve client build in production (monorepo deployment)
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  const clientDist = path.join(__dirname, "dist");
  app.use(express.static(clientDist));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}
