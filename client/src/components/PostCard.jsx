import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deletePost, ratePost } from "../services/postService";
import { useNavigate } from "react-router-dom";
import "./PostCard.css";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  const isOwner =
    (post.user?._id
      ? post.user._id.toString()
      : post.user?.toString()) === user?._id?.toString();

  return (
    <div className="post-card card">

      {/* TITLE */}
      <h3 className="post-title">{post.title}</h3>

      {/* MEDIA */}
      {post.mediaUrl && (
        <div className="media-wrapper">

          {post.contentType === "photo" && (
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="post-media"
            />
          )}

          {post.contentType === "video" && (
            <video
              controls
              src={post.mediaUrl}
              className="post-media"
            />
          )}

          {post.contentType === "audio" && (
            <audio
              controls
              src={post.mediaUrl}
              className="post-audio"
            />
          )}

          {post.contentType === "book" && (
            <a
              href={`${post.mediaUrl}?download=${post.title || "document"}.pdf`}
              className="pdf-link"
            >
              📘 Download PDF
            </a>
          )}
        </div>
      )}

      {/* TEXT */}
      {post.content && (
        <div className="post-content-wrapper">
          <p
            className={`post-content ${
              expanded ? "expanded" : "collapsed"
            }`}
          >
            {post.content}
          </p>

          {post.content.length > 200 && (
            <button
              className="read-more-btn"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      )}

      {/* META */}
      <div className="post-meta">
        <span className="rating">
          ⭐ {post.averageRating?.toFixed(1) || 0}
        </span>
        <span className="author">• {post.user?.name}</span>
      </div>

      {/* ACTIONS */}
      {user && (
        <div className="post-actions">

          {isOwner && (
            <button
              className="btn edit-btn"
              onClick={() => navigate(`/edit/${post._id}`)}
            >
              ✏ Edit
            </button>
          )}

          {(isOwner || user?.role === "admin") && (
            <button
              className="btn delete-btn"
              onClick={async () => {
                if (window.confirm("Delete this post?")) {
                  await deletePost(post._id);
                  window.location.reload();
                }
              }}
            >
              🗑 Delete
            </button>
          )}

          {!isOwner && (
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${
                    star <= Math.round(post.averageRating)
                      ? "active"
                      : ""
                  }`}
                  onClick={async () => {
                    try {
                      await ratePost(post._id, star);
                      window.location.reload();
                    } catch (err) {
                      alert("You already rated this post");
                    }
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
