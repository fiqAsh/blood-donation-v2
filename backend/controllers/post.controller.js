import Post from "../models/post.model.js";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  try {
    const { description, bloodGroup, location } = req.body;
    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({ message: "Location is required" });
    }

    const newPost = await Post.create({
      description,
      bloodGroup,
      location,
      user: req.user._id,
    });

    const nearbyUsers = await User.find({
      location: {
        $geoWithin: {
          $centerSphere: [[location.longitude, location.latitude], 3 / 6378.1],
        },
      },
      bloodGroup: bloodGroup,
      _id: { $ne: req.user._id },
    });

    const notifications = nearbyUsers.map((user) => ({
      user: user._id,
      message: `Urgent: A new blood request has been made near you!`,
      post: newPost._id,
    }));

    const savedNotifications = await Notification.insertMany(notifications);

    res.status(201).json({ post: newPost, notifications: savedNotifications });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Post creation failed", error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userPosts = await Post.find({ _id: { $in: user.posts } }).sort({
      createdAt: -1,
    });
    res.status(200).json(userPosts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user posts", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postid } = req.params;
    const { description, pending } = req.body;

    const post = await Post.findById(postid);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (description !== undefined) {
      post.description = description;
    }

    if (pending !== undefined) {
      post.pending = pending;
    }

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postid } = req.params;

    const post = await Post.findById(postid);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.findByIdAndDelete(postid);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    });
  }
};
