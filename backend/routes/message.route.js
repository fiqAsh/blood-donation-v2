import express from "express";
import {
  getUsers,
  getMessages,
  sendMessage,
  getConversationUsers,
} from "../controllers/message.controller.js";
import { authenticateUser } from "../utils/auth.middleware.js";
const router = express.Router();

router.get("/conversations", authenticateUser, getConversationUsers);
router.get("/users", authenticateUser, getUsers);
router.get("/:userId", authenticateUser, getMessages);
router.post("/", authenticateUser, sendMessage);

export default router;
