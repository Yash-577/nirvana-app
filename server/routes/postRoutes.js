import express from "express";
import {
  createPost,
  getAllPosts,
  getTopRatedPosts,
  searchPosts,
  ratePost,
  deletePost,
  getPendingPosts,
  approvePost,
  hidePost,
  updatePost,
  getPostById,

} from "../controllers/postController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private
 */
router.post("/", authMiddleware, createPost);

/**
 * @route   GET /api/posts/search
 * @desc    Search + filters + pagination
 * @access  Public
 */
router.get("/search", searchPosts);

/**
 * @route   GET /api/posts/top
 * @desc    Get top rated posts
 * @access  Public
 */
router.get("/top", getTopRatedPosts);

/**
 * @route   GET /api/posts/:id
 * @desc    Get single post
 * @access  Public
 */
router.get("/:id", getPostById);


/**
 * @route   GET /api/posts
 * @desc    Get all approved posts
 * @access  Public
 */
router.get("/", getAllPosts);

/**
 * @route   POST /api/posts/:id/rate
 * @desc    Rate a post
 * @access  Private
 */
router.post("/:id/rate", authMiddleware, ratePost);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post
 * @access  Private/Admin
 */
router.delete("/:id", authMiddleware, deletePost);

//update route
/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post
 * @access  Private
 */
router.put("/:id", authMiddleware, updatePost);


/**
 * -------- ADMIN MODERATION ROUTES --------
 */

/**
 * @route   GET /api/posts/pending
 * @desc    Get unapproved posts
 * @access  Private/Admin
 */
router.get(
  "/pending",
  authMiddleware,
  adminMiddleware,
  getPendingPosts
);

/**
 * @route   PUT /api/posts/:id/approve
 * @desc    Approve a post
 * @access  Private/Admin
 */
router.put(
  "/:id/approve",
  authMiddleware,
  adminMiddleware,
  approvePost
);


/**
 * @route   PUT /api/posts/:id/hide
 * @desc    Hide / unapprove a post
 * @access  Private/Admin
 */
router.put(
  "/:id/hide",
  authMiddleware,
  adminMiddleware,
  hidePost
);

export default router;
