import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

/**
 * @desc    Create a comment on a post
 * @route   POST /api/comments/:postId
 * @access  Private
 */
export const createComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    if (!text) {
      res.status(400);
      throw new Error("Comment text is required");
    }

    const post = await Post.findById(postId);
    if (!post || !post.isApproved) {
      res.status(404);
      throw new Error("Post not found or not approved");
    }

    const comment = await Comment.create({
      text,
      user: req.user._id,
      post: postId,
      isApproved: false, // admin approval required
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get approved comments for a post
 * @route   GET /api/comments/:postId
 * @access  Public
 */
export const getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      isApproved: true,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment (admin only)
 * @route   DELETE /api/comments/:id
 * @access  Private/Admin
 */
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * -------- ADMIN MODERATION --------
 */

/**
 * @desc    Get all unapproved comments
 * @route   GET /api/comments/pending
 * @access  Private/Admin
 */
export const getPendingComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ isApproved: false })
      .populate("user", "name email")
      .populate("post", "title")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve a comment
 * @route   PUT /api/comments/:id/approve
 * @access  Private/Admin
 */
export const approveComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }

    comment.isApproved = true;
    await comment.save();

    res.json({ message: "Comment approved successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Hide / unapprove a comment
 * @route   PUT /api/comments/:id/hide
 * @access  Private/Admin
 */
export const hideComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }

    comment.isApproved = false;
    await comment.save();

    res.json({ message: "Comment hidden successfully" });
  } catch (error) {
    next(error);
  }
};
