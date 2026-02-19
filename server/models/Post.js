import mongoose from "mongoose";

const postSchema= mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
      type: String,
      required: true,
      trim: true,
    },

    // Text content (blogs, articles, descriptions)
    content: {
      type: String,
    },

    // What kind of content this is
    contentType: {
      type: String,
      enum: ["photo", "video", "blog", "article", "book", "audio"],
      required: true,
    },
      // Media URL (Cloudinary link)
    mediaUrl: {
      type: String,
    },

    ratings: [
        {
            user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
            },
             value: {
          type: Number,
          min: 1,
          max: 5,
        },
        },
    ],
     // Average rating
    averageRating: {
      type: Number,
      default: 0,
    },

    // Total number of ratings
    totalRatings: {
      type: Number,
      default: 0,
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

const Post= mongoose.model("Post", postSchema);

export default Post;