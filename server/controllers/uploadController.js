import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/**
 * @desc    Upload file to Cloudinary
 * @route   POST /api/upload
 * @access  Private
 */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Detect file extension
    const fileExt = req.file.originalname.split(".").pop().toLowerCase();

    let resourceType = "auto";

    if (fileExt === "pdf") {
      resourceType = "raw";
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: resourceType,
      folder: "nirvana",
      use_filename: true,
      unique_filename: true,
    });

    // Remove file from local storage after upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
    });

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};
