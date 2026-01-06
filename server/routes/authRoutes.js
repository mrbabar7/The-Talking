const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
authRouter.post("/signup", authController.postSignup);
authRouter.post("/login", authController.postLogin);
authRouter.get("/check", authController.checkUser);
authRouter.get("/logout", authController.logout);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password/:token", authController.resetPassword);

exports.authRouter = authRouter;
