const express = require("express");
const chatRouter = express.Router();
const chatController = require("../controllers/chatController");
chatRouter.get("/contacts", chatController.contactList);
chatRouter.post("/chat-contact", chatController.chatContact);
chatRouter.post("/voice-message", chatController.voiceMessage);
chatRouter.get("/chat-contact/:contactId", chatController.getChatMessages);
chatRouter.get("/conversations", chatController.getConversations);
exports.chatRouter = chatRouter;
