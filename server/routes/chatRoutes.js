import express from "express";
import {
  accessChat,
  sendMessage,
  getUserChats,
  getChatMessages,
} from "../controllers/chatController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/chats
 * @desc    Create or access a private chat
 * @access  Private
 */
router.post("/", authMiddleware, accessChat);

/**
 * @route   GET /api/chats
 * @desc    Get all chats of logged-in user
 * @access  Private
 */
router.get("/", authMiddleware, getUserChats);

/**
 * @route   GET /api/chats/:chatId
 * @desc    Get messages of a specific chat
 * @access  Private
 */
router.get("/:chatId", authMiddleware, getChatMessages);

/**
 * @route   POST /api/chats/:chatId/message
 * @desc    Send a message in a chat
 * @access  Private
 */
router.post("/:chatId/message", authMiddleware, sendMessage);

export default router;
