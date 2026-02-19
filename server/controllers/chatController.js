import Chat from "../models/Chat.js";

/**
 * @desc    Create or get a private chat between two users
 * @route   POST /api/chats
 * @access  Private
 */
import mongoose from "mongoose";
import User from "../models/User.js";

 export const accessChat = async (req, res, next) => {
  try {
    const { identifier } = req.body; // email or name

    if (!identifier) {
      res.status(400);
      throw new Error("Email or name is required");
    }

    if (!req.user?._id) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    // 🔎 Find user by email OR name
   const targetUser = await User.findOne({
  $or: [
    { email: identifier.toLowerCase() },
    { name: { $regex: `^${identifier}$`, $options: "i" } }
  ],
});

    if (!targetUser) {
      res.status(404);
      throw new Error("User not found");
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot chat with yourself");
    }

    // 🔍 Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, targetUser._id] },
    }).populate("participants", "name email");

    if (chat) {
      return res.json(chat);
    }

    // 🆕 Create new chat
    const newChat = await Chat.create({
      participants: [req.user._id, targetUser._id],
      messages: [],
    });

    const fullChat = await Chat.findById(newChat._id)
      .populate("participants", "name email");

    res.status(201).json(fullChat);

  } catch (error) {
    console.error("ACCESS CHAT ERROR:", error.message);
    next(error);
  }
};
export const sendMessage = async (req, res, next) => {
  try {
    const { text, mediaUrl } = req.body;
    const { chatId } = req.params;

    if (!text && !mediaUrl) {
      res.status(400);
      throw new Error("Message text or media is required");
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404);
      throw new Error("Chat not found");
    }

    // Ensure sender is part of chat
  if (
  !chat.participants.some(
    (p) => p.toString() === req.user._id.toString()
  )
) {
      res.status(403);
      throw new Error("Not authorized to send message in this chat");
    }

    const message = {
      sender: req.user._id,
      text,
      mediaUrl,
    };

    chat.messages.push(message);
    await chat.save();

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all chats of logged-in user
 * @route   GET /api/chats
 * @access  Private
 */
export const getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate("participants", "name email")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get messages of a chat
 * @route   GET /api/chats/:chatId
 * @access  Private
 */
export const getChatMessages = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("participants", "name email")
      .populate("messages.sender", "name email");

    if (!chat) {
      res.status(404);
      throw new Error("Chat not found");
    }

    // Ensure user is part of chat
    if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error("Not authorized to view this chat");
    }

    res.json(chat);
  } catch (error) {
    next(error);
  }
};
