import { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import api from "../services/api";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);

  const fetchPosts = useCallback(async () => {
    if (!hasMore || isFetching.current) return;

    isFetching.current = true;
    setLoading(true);

    try {
      const { data } = await api.get(
        `/posts?page=${page}&limit=10&sort=top`
      );

      const newPosts = Array.isArray(data) ? data : data.posts;

      setPosts((prevPosts) => {
        const combined = [...prevPosts, ...newPosts];

        return combined.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p._id === post._id)
        );
      });

      if (!Array.isArray(data)) {
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load posts", error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [page, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (!loading && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <>
      <Navbar />

      <main className="home-container">
        {posts.length === 0 && loading && (
          <div className="home-status loading">
            <div className="spinner"></div>
            <p>Loading feed...</p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="home-status empty">
            <h3>No content yet 🌿</h3>
            <p>Be the first to share something meaningful.</p>
          </div>
        )}

        <div className="home-feed">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {loading && posts.length > 0 && (
          <div className="home-status loading-more">
            <div className="spinner small"></div>
            <p>Loading more posts...</p>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="home-status end">
            <p>No more posts to show</p>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
