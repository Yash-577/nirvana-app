import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    // Comment text
    text: {
      type: String,
      required: true,
      trim: true,
    },

    // Who commented
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // On which post
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    // Admin moderation
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;