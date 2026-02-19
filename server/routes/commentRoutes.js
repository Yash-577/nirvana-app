import express from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  getPendingComments,
  approveComment,
  hideComment,
} from "../controllers/commentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/comments/:postId
 * @desc    Create comment
 * @access  Private
 */
router.post("/:postId", authMiddleware, createComment);

/**
 * @route   GET /api/comments/:postId
 * @desc    Get approved comments for post
 * @access  Public
 */
router.get("/:postId", getCommentsByPost);

/**
 * -------- ADMIN MODERATION ROUTES --------
 */

/**
 * @route   GET /api/comments/pending
 * @desc    Get unapproved comments
 * @access  Private/Admin
 */
router.get(
  "/pending",
  authMiddleware,
  adminMiddleware,
  getPendingComments
);

/**
 * @route   PUT /api/comments/:id/approve
 * @desc    Approve comment
 * @access  Private/Admin
 */
router.put(
  "/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveComment
);

/**
 * @route   PUT /api/comments/:id/hide
 * @desc    Hide / unapprove comment
 * @access  Private/Admin
 */
router.put(
  "/:id/hide",
  authMiddleware,
  adminMiddleware,
  hideComment
);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete comment
 * @access  Private/Admin
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteComment
);

export default router;
