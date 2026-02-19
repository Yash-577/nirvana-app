import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch post by ID
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setTitle(data.title || "");
        setContent(data.content || "");
      } catch (err) {
        console.error("Failed to fetch post", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/posts/${id}`, {
        title,
        content,
      });

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading post...</p>;

  return (
    <>
      <Navbar />

      {/* SUCCESS TOAST */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#2ecc71",
            color: "#fff",
            padding: "14px 20px",
            borderRadius: "10px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            fontWeight: "500",
            zIndex: 999,
          }}
        >
          ✅ Post updated successfully
        </div>
      )}

      <main
        style={{
          maxWidth: "600px",
          margin: "2rem auto",
          padding: "0 1rem",
        }}
      >
        <h2 style={{ marginBottom: "1.2rem" }}>Edit Post ✏</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Content</label>
            <textarea
              rows="6"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "10px 18px",
              cursor: "pointer",
              borderRadius: "6px",
              border: "none",
              background: "var(--primary-green)",
              color: "#fff",
              fontWeight: "500",
            }}
          >
            {saving ? "Saving..." : "Update Post"}
          </button>
        </form>
      </main>
    </>
  );
};

export default Edit;
