import Post from "../models/Post.js";

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
export const createPost = async (req, res, next) => {
  try {
    const { title, content, contentType, mediaUrl } = req.body;

    if (!title || !contentType) {
      res.status(400);
      throw new Error("Title and content type are required");
    }

    const post = await Post.create({
      user: req.user._id,
      title,
      content,
      contentType,
      mediaUrl,
      isApproved: true, // admin approval required
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Get single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name email");

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all approved posts (latest first)
 * @route   GET /api/posts
 * @access  Public
 */
export const getAllPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortType = req.query.sort; // 👈 add this
    const skip = (page - 1) * limit;

    let sortOption = { createdAt: -1 }; // default: latest

    if (sortType === "top") {
      sortOption = {
        averageRating: -1,
        totalRatings: -1,
        createdAt: -1,
      };
    }

    const posts = await Post.find({ isApproved: true })
      .populate("user", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ isApproved: true });

    res.json({
      posts,
      hasMore: skip + posts.length < total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Get top rated posts
 * @route   GET /api/posts/top
 * @access  Public
 */
export const getTopRatedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ isApproved: true })
      .populate("user", "name email")
      .sort({
        averageRating: -1,   // Highest rating first
        totalRatings: -1,    // If same rating → more votes first
        createdAt: -1        // If same → newest first
      })
      .limit(10);

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search, filter & paginate posts
 * @route   GET /api/posts/search
 * @access  Public
 */
export const searchPosts = async (req, res, next) => {
  try {
    const {
      keyword,
      contentType,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isApproved: true };

    // Keyword search (title + content)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ];
    }

    // Filter by content type
    if (contentType) {
      query.contentType = contentType;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // latest
    if (sort === "rating") {
      sortOption = { averageRating: -1 };
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const totalPosts = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate("user", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.json({
      posts,
      page: pageNumber,
      pages: Math.ceil(totalPosts / pageSize),
      totalPosts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Rate a post
 * @route   POST /api/posts/:id/rate
 * @access  Private
 */
export const ratePost = async (req, res, next) => {
  try {
    const { value } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post || !post.isApproved) {
      res.status(404);
      throw new Error("Post not found or not approved");
    }

    const alreadyRated = post.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyRated) {
      res.status(400);
      throw new Error("You have already rated this post");
    }

    post.ratings.push({
      user: req.user._id,
      value,
    });

    post.totalRatings = post.ratings.length;
    post.averageRating =
      post.ratings.reduce((acc, item) => acc + item.value, 0) /
      post.totalRatings;

    await post.save();

    res.json({ message: "Post rated successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a post (admin)
 * @route   DELETE /api/posts/:id
 * @access  Private/Admin
 */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    // Allow owner OR admin
    if (
      post.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(401);
      throw new Error("Not authorized to delete this post");
    }

    await post.deleteOne();

    res.json({ message: "Post removed successfully" });
  } catch (error) {
    next(error);
  }
};

//update post
export const updatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    // Only owner can edit
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized to edit this post");
    }

    post.title = title || post.title;
    post.content = content || post.content;

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

/**
 * -------- ADMIN MODERATION --------
 */

/**
 * @desc    Get all unapproved posts
 * @route   GET /api/posts/pending
 * @access  Private/Admin
 */
export const getPendingPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ isApproved: false })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve a post
 * @route   PUT /api/posts/:id/approve
 * @access  Private/Admin
 */
export const approvePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    post.isApproved = true;
    await post.save();

    res.json({ message: "Post approved successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Hide / unapprove a post
 * @route   PUT /api/posts/:id/hide
 * @access  Private/Admin
 */
export const hidePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    post.isApproved = false;
    await post.save();

    res.json({ message: "Post hidden successfully" });
  } catch (error) {
    next(error);
  }
};
