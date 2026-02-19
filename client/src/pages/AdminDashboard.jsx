import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const AdminDashboard = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [pendingComments, setPendingComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchModerationData = async () => {
    try {
      const postsRes = await api.get("/posts/pending");
      const commentsRes = await api.get("/comments/pending");

      setPendingPosts(postsRes.data);
      setPendingComments(commentsRes.data);
    } catch (err) {
      console.error("Failed to load moderation data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationData();
  }, []);

  const approvePost = async (id) => {
    await api.put(`/posts/${id}/approve`);
    fetchModerationData();
  };

  const hidePost = async (id) => {
    await api.put(`/posts/${id}/hide`);
    fetchModerationData();
  };

  const approveComment = async (id) => {
    await api.put(`/comments/${id}/approve`);
    fetchModerationData();
  };

  const hideComment = async (id) => {
    await api.put(`/comments/${id}/hide`);
    fetchModerationData();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center" }}>Loading moderation panel…</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main
        style={{
          maxWidth: "800px",
          margin: "1.5rem auto",
          padding: "0 1rem",
        }}
      >
        <h2>Admin Dashboard 🛡️</h2>

        {/* ---------------- POSTS ---------------- */}
        <section className="card" style={{ marginBottom: "1.5rem" }}>
          <h3>Pending Posts</h3>

          {pendingPosts.length === 0 && (
            <p>No pending posts 🎉</p>
          )}

          {pendingPosts.map((post) => (
            <div
              key={post._id}
              style={{
                borderBottom: "1px solid var(--border-color)",
                padding: "0.6rem 0",
              }}
            >
              <strong>{post.title}</strong>
              <p style={{ color: "var(--muted-text)" }}>
                by {post.user?.name}
              </p>

              <button
                className="button-primary"
                onClick={() => approvePost(post._id)}
                style={{ marginRight: "0.5rem" }}
              >
                Approve
              </button>

              <button onClick={() => hidePost(post._id)}>
                Hide
              </button>
            </div>
          ))}
        </section>

        {/* ---------------- COMMENTS ---------------- */}
        <section className="card">
          <h3>Pending Comments</h3>

          {pendingComments.length === 0 && (
            <p>No pending comments 🎉</p>
          )}

          {pendingComments.map((comment) => (
            <div
              key={comment._id}
              style={{
                borderBottom: "1px solid var(--border-color)",
                padding: "0.6rem 0",
              }}
            >
              <p>"{comment.text}"</p>
              <p style={{ color: "var(--muted-text)" }}>
                by {comment.user?.name} on{" "}
                <strong>{comment.post?.title}</strong>
              </p>

              <button
                className="button-primary"
                onClick={() => approveComment(comment._id)}
                style={{ marginRight: "0.5rem" }}
              >
                Approve
              </button>

              <button onClick={() => hideComment(comment._id)}>
                Hide
              </button>
            </div>
          ))}
        </section>
      </main>
    </>
  );
};

export default AdminDashboard;
