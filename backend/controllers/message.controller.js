import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select(
      "name email"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;
  try {
    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      text,
    });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getConversationUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all messages involving the user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    // Extract unique user IDs of others involved
    const userIds = new Set();
    messages.forEach((msg) => {
      if (msg.sender.toString() !== userId) {
        userIds.add(msg.sender.toString());
      }
      if (msg.receiver.toString() !== userId) {
        userIds.add(msg.receiver.toString());
      }
    });

    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select(
      "name email"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
