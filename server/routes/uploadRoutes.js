import express from "express";
import { uploadFile } from "../controllers/uploadController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload media to Cloudinary
 * @access  Private
 */
router.post("/", authMiddleware, upload.single("file"), uploadFile);

export default router;
