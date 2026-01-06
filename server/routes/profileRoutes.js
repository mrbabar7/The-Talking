const express = require("express");
const profileRouter = express.Router();
const profileController = require("../controllers/profileController");
profileRouter.get("/add", profileController.addProfile);
profileRouter.put("/edit", profileController.editProfile);
exports.profileRouter = profileRouter;
