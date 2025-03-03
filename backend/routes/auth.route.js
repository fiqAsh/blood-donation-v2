import express from "express";

import {
  login,
  signup,
  logout,
  getUserProfile,
  updateUser,
  getAllUser,
} from "../controllers/auth.controller.js";
import authMiddleware from "../utils/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getUserProfile", authMiddleware, getUserProfile);
router.get("/getAllUser", authMiddleware, getAllUser);
router.patch("/updateUser", authMiddleware, updateUser);

export default router;
