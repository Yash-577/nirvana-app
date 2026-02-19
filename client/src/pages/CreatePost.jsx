import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createPost, uploadMedia } from "../services/postService";
import "./CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("photo");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let mediaUrl = "";

      if (file) {
        const uploadResult = await uploadMedia(file);
        mediaUrl = uploadResult.url;
      }

      await createPost({
        title,
        content,
        contentType,
        mediaUrl,
      });

      navigate("/");
    } catch (error) {
      console.error("Failed to create post", error);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="create-container">
        <h2 className="create-title">Create Post 🌿</h2>

        <form onSubmit={handleSubmit} className="create-card card">

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter a title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              <option value="photo">Photo</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="blog">Blog</option>
              <option value="article">Article</option>
              <option value="book">Book (PDF)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Content (Optional)</label>
            <textarea
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>

         <div className="form-group">
  <label>Upload File</label>

  <div className="file-upload-wrapper">
    <label className="custom-file-btn">
      Choose File
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        hidden
      />
    </label>

    <span className="file-name">
      {file ? file.name : "No file selected"}
    </span>
  </div>
</div>

          <button
            className="submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Posting..." : "Publish Post"}
          </button>

        </form>
      </main>
    </>
  );
};

export default CreatePost;
