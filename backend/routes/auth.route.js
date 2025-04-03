import express from "express";

import {
  login,
  signup,
  logout,
  getUserProfile,
  updateUser,
  getAllUser,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../utils/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshAccessToken", refreshAccessToken);
router.get("/getUserProfile", authenticateUser, getUserProfile);
router.get("/getAllUser", authenticateUser, getAllUser);
router.patch("/updateUser/:id", authenticateUser, updateUser);

export default router;
