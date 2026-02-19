import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        Nirvana
      </Link>

      {/* Actions */}
      <div className="navbar-actions">
        <Link to="/" className="nav-icon">🏠</Link>
        <Link to="/create" className="nav-icon">➕</Link>
        <Link to="/chats" className="nav-icon">💬</Link>
        <Link to="/profile" className="nav-icon">👤</Link>
        <Link to="/about" className="nav-icon nav-about">
  <span className="about-text">About</span>
  <span className="about-icon">ℹ️</span>
</Link>



        <ThemeToggle />

        {user && (
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            🚪
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
