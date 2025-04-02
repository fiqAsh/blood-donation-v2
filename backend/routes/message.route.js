import express from "express";
import { authenticateUser } from "../utils/auth.middleware.js";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:id", authenticateUser, getMessages);
router.post("/send/:id", authenticateUser, sendMessage);

export default router;
