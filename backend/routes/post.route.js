import express from "express";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

import authMiddleware from "../utils/auth.middleware.js";

const router = express.Router();

router.post("/createPost", authMiddleware, createPost);
router.get("/getAllPosts", authMiddleware, getAllPosts);
router.get("/getUserPosts/:userId", authMiddleware, getUserPosts);
router.patch("/updatePost/:postid", authMiddleware, updatePost);
router.delete("/deletePost/:postid", authMiddleware, deletePost);

export default router;
